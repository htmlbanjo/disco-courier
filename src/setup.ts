import prompts from 'prompts'
import chalk from 'chalk'

import fs from 'fs'
import minimist from 'minimist2'
//import produce from "immer"

import { parser } from 'stream-json'
import { chain } from 'stream-chain'
import Asm from 'stream-json/Assembler'
import { pick } from 'stream-json/filters/Pick'
import { streamValues } from 'stream-json/streamers/StreamValues'
import { streamArray } from 'stream-json/streamers/StreamArray'

import { jsonHeader, jsonFooter, sourceFileExists, write, writeStream, read, seed } from './util/migration.util'
import { templatize } from './templates/migration.tmpl'
import { connect } from './util/database.util'
import { ICurrentVersion, ISupportedVersion } from './defs/import'

(async () => {
  let connection;
  const args = minimist(process.argv.slice(2))
  const output = (args['export'] === 'db') ? 'seed' : (args['export']) === 'json' ? 'write' : 'read' 

  const options = {
    entityList: ['actors','locations'],
    sourceJSON: 'dialog',
    supportedVersions:<ISupportedVersion[]> [{
      version:<string> '4/6/2021 11:49:13 AM',
      rowCounts: {
        locations: 2,
        actors: 420,
        variables: 10510,
      }
    }]
  }
  const state = {
    messages: [],
    currentVersion:<ICurrentVersion> {
      version: false
    }
  }
  const entities = ['actors','locations'] //'actors','locations','variables','items','conversations'

  const updateProgress = (note:string = '...'):void => {
    let prog = ''
    let output = ''
    let rest = '           '.substring(0, (10 - state.messages.length))
    state.messages.map((msg, i) => { 
      prog += '='
      output += (i+1 === state.messages.length) ? `\n\n          ✓ ${chalk.italic(chalk.bold(chalk.greenBright(msg)))}` : `\n\n          ✓ ${msg}`
    })
    console.clear()
    console.log(`\n\n\n   [${chalk.bgGreen(chalk.green(prog))}${rest}]\n\n\n          ${chalk.italic(chalk.blueBright(note))}`, `${chalk.green(output)}`)
  }

  const versionList = ():string => {
    return options.supportedVersions.reduce((versions:string[], v:ISupportedVersion) =>  {
      versions.push(v.version)
      return versions
    },[] as string[]).join(', ')
  }

  const isSupportedVersion = async (source: string):Promise<boolean> =>  {
    const pipe = chain([
      fs.createReadStream(`./src/data/${source}.json`),
      parser(),
      pick({ filter: 'version' }),
      streamValues(),
      data => options.supportedVersions.find(entry => entry.version === data.value) || false
    ])
    return await pipe.on('data', data => {
      state.currentVersion = data
      return !!state.currentVersion.version
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
        let note = `${activity[(counter < 4) ? counter=counter++ : 0]} Migrating ${chalk.italic(chalk.inverse(entity))} - row ${totalRows}`
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
        state.messages.push(`${entity} stream processed (read ${totalRows} rows)`)
        updateProgress('Generating output...')
        if(merge === true) {
          action(entity, entity, all)
        }
      }
    })
  }

  const end = (row:number) => {
    if(row+1 === options.entityList.length) {
      state.messages.push(`Done!`)
      updateProgress()
      process.exit(0)
    }
  }

  const exportEntities = (file, output) => {
    let filename

    options.entityList.map((entity, i) => {

      updateProgress(`* Processing ${entity}...`)     
      exportEntity(file, entity, true, (entityname, entityId, entityData) => {
        switch(output) {

          case 'read':
            read(entityname, entityId, entityData)
            break

          case 'write':
            const fileStream = writeStream(entity, entity)
            fileStream.write(JSON.stringify(entityData, null, 2), () => {
              // TODO - need callback from fileStream so we know we're *actually* done with the write portion
              state.messages.push(`Exporting ${entityname} data (${entityData[entity].length} rows) to ${entityname}.json )......Success!`)
              updateProgress()
              end(i)
            })
            break

          case 'seed':
            filename = seed(entityname, entityId, entityData[entity])
            state.messages.push(`Exporting ${entityname} data (${entityData[entity].length} rows) to ${filename} )......Success!`)
            updateProgress()
            end(i)
            break

          default:
            read(entityname, entityId, entityData)
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
  isSupportedVersion(options.sourceJSON).then((supported:boolean) => {
    // TODO: addtl. versions
    if(supported) {
      state.messages.push(`Supported version found! ${state.currentVersion.version}. Well done detective.`)
      updateProgress('Opening Source Json...')
      exportEntities(options.sourceJSON, output)
    } else {
      console.log(chalk.red(`Sorry, the version of your data isn't supported. Supported versions: ${versionList()}`))
      process.exit(0)
    }
  })

})()