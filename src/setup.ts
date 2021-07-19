import chalk from 'chalk'
import prompts from 'prompts'

import fs from 'fs'
import minimist from 'minimist2'
//import produce from "immer"

import { parser } from 'stream-json'
import { chain } from 'stream-chain'
import Asm from 'stream-json/Assembler'
import { pick } from 'stream-json/filters/Pick'
import { streamValues } from 'stream-json/streamers/StreamValues'
import { streamArray } from 'stream-json/streamers/StreamArray'

import { sourceFileExists, seedFileName, writeStream, read, seed } from './util/migration.util'
import { templatize } from './templates/migration.tmpl'
import { connect } from './util/database.util'
import { ICurrentVersion, ISupportedVersion } from './defs/import'

(async () => {
  let connection;
  const args = minimist(process.argv.slice(2))
  const output = (args['export'] === 'db') ? 'seed' : (args['export']) === 'json' ? 'write' : 'read' 
  
  const setEntityList = ():string[] => {
    // TODO: populate entityList from an initial list tied to options.versions,
    // to support different keys across different versions
    const entityList = ['actors','locations','variables','items'] //  'conversations' 
    if(!!!args['_']) { return entityList }

    const userEntityList = args['_'].reduce((list:string[], arg:string) => {
      // longest entity is currently 13 (conversations), not concerned w/ exactness here.
      const cleaned = arg.trim().toLowerCase().substring(0, 25)
      if(entityList.includes(cleaned)) {
        list.push(cleaned)
        return list
      } else {
        console.log(chalk.red(`\n\n\nUnrecognized field: ${arg}. Available args are: Actors, Locations, Variables, Items, Conversations (case-insensetive).`))
        process.exit(1)
      }
      return list
    },[] as string[])
    return userEntityList
  }

  const options = {
    entityList: setEntityList(),
    sourceJSON: 'dialog',
    supportedVersions:<ISupportedVersion[]> [{
      version:<string> '4/6/2021 11:49:13 AM',
      rowCounts: {
        locations: 2,
        actors: 420,
        items: 258,
        variables: 10510,
      }
    }]
  }
  const state = {
    start:<number> Date.now(),
    messages:<string[]> [],
    output: [],
    currentVersion:<ICurrentVersion> {
      version: false
    }
  }

  const updateProgress = (note:string = '...'):void => {
    let prog = ''
    let output = ''
    let rest = '           '.substring(0, (10 - state.messages.length))
    state.messages.map((msg, m) => { 
      prog += '='
      output += (m+1 === state.messages.length) ? `\n\n          ✓ ${chalk.bold(chalk.greenBright(msg))}` : `\n\n          ✓ ${msg}`
    })
    console.clear()
    console.log(`\n\n\n   [${chalk.bgGreen(chalk.green(prog))}${rest}]\n\n\n          ${chalk.blueBright(note)}`, `${chalk.green(output)}`)
  }

  const versionList = ():string => {
    return options.supportedVersions.reduce((versions:string[], v:ISupportedVersion) =>  {
      versions.push(v.version)
      return versions
    },[] as string[]).join(', ')
  }

  const isSupportedVersion = (source: string, action: (matchedVersion) => void) =>  {
    const pipe = chain([
      fs.createReadStream(`./src/data/${source}.json`),
      parser(),
      pick({ filter: 'version' }),
      streamValues(),
      data => options.supportedVersions.find(entry => entry.version === data.value) || false
    ])
    pipe.on('data', data => {
      if(!!data?.version) {
        action(data)
      } else {
        console.log(chalk.red(`Sorry, the version of your data isn't supported. Supported versions: ${versionList()}`))
        process.exit(0)
      }
    })
  }

  const streamSource = (source: string, entity: string) => {
    return chain([
      fs.createReadStream(`./src/data/${source}.json`),
      parser(),
      pick({ filter: entity }),
      streamArray(),
      data => templatize(entity, data.value),
    ])
  }

  const exportEntity = async (source, entity, merge=true, action:(entity, id, data)=> void) => {
    let all = { }
    all[entity] = []
    const pipe = streamSource(source, entity)
    const stream = Asm.connectTo(pipe)
    
    const activity = ['◉','⧇','⦾','⦿','✿']
    let counter = 0
    let totalRows = 0
    
    pipe.on('data', data => {
      ++totalRows
      if(data.id % 7 === 0) {
        let note = `${activity[(counter < 4) ? counter=counter++ : 0]} `
        note += `Migrating ${chalk.inverse(entity)} - row ${totalRows} `
        
        if(data?.fields) { note += (data.fields[0]?.value) ? `(${data?.fields[0]?.value})` : '...' }
        if(entity === 'conversations') {
          note += '(BUCKLE UP, this step can take upwards of 5 minutes depending on your machine)'
        }
        updateProgress(note)  
      }
      if(merge === true) {
        // TODO - pushing directly to file during stream,
        // adding a header/footer in parent method should improve performance.
        all[entity].push(data)
      } else {
        // TODO, bring back option for calling exportEntity on a per-row basis.
        // This would support e.g. a noSQL doc for each row.
        // action(entity, data.id, data)
      }
      if(totalRows === state.currentVersion?.rowCounts[entity]) {
        if(all[entity].length < 1) {
          console.log(chalk.red(`No entries found`))
          process.exit(1)
        }
        state.messages.push(`Stream processed: ${entity} (read ${totalRows} rows)`)
        updateProgress('Generating output...')
        if(merge === true) {
          action(entity, entity, all)
        }
      }
    })
  }

  const end = (entityCount:number, totalEntities:number = options.entityList.length) => {
    const casualPerfTime = Math.round((Date.now() - state.start) / 1000);
    if(entityCount === totalEntities) {
      state.messages.push(`Done!`)
      updateProgress(`Setup Completed in ${casualPerfTime} seconds.`)
      if(output === 'read') {
        state.output.map(result => result() )
      }
      process.exit(0)
    }
  }

  // TODO: more async/await, less c.b.h / triangle-of-death
  const exportEntities = (file, output) => {
    let fileStream
    let entityCount:number = 0
    options.entityList.map((entity, i) => {
      updateProgress(`* Processing ${entity}...`)     
      exportEntity(file, entity, true, (entityname, entityId, entityData) => {
        
        updateProgress(`Exporting data...`)
        fileStream = writeStream(output, entity, entity)

        switch(output) {

          case 'read':

            state.output.push(read(entityname, entityId, entityData))
            end(++entityCount)
            break
          
          case 'write':

            fileStream.write(JSON.stringify(entityData, null, 2), () => {
              // TODO - need callback from fileStream so we know we're *actually* done with the write portion
              state.messages.push(`Exporting ${entityname} data (${entityData[entity].length} rows) to ${entityname}.json )......Success!`)
              updateProgress()
              end(++entityCount)
            })
            break

          case 'seed':

            updateProgress()
            fileStream.write(seed(entityname, entityData[entity]), () => {
              state.messages.push(`Exporting ${entityname} data (${entityData[entity].length} rows) to "${seedFileName(entityname)}".......Success!`)
              updateProgress()
              end(++entityCount)
            })
            break

          default:

            state.output.push(read(entityname, entityId, entityData))
            end(entityCount)
            break
        }
      })
    })
  }

  updateProgress('Do you even json?')
  if(!sourceFileExists(options.sourceJSON)) {
    console.log(chalk.red(`Installation failed. Couldn't find "data/${options.sourceJSON}.json" file.`))
    process.exit(0)
  }

  state.messages.push(`${options.sourceJSON}.json file found. You did it! You showed up.`)
  updateProgress()

  updateProgress('Peeking under the hood for a valid version of data...')
  isSupportedVersion(options.sourceJSON, (versionResult) => {
    // TODO: addtl. versions
    state.currentVersion = versionResult
    state.messages.push(`Supported version found! (${state.currentVersion.version}) Well done detective.`)
    updateProgress('Opening Source Json...')
    exportEntities(options.sourceJSON, output)
  })

})()