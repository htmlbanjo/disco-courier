import prompts from 'prompts'
import chalk from 'chalk'

import fs from 'fs'
import minimist from 'minimist2'

import { parser } from 'stream-json'
import { chain } from 'stream-chain'
import Asm from 'stream-json/Assembler'
import { pick } from 'stream-json/filters/Pick'
import { streamValues } from 'stream-json/streamers/StreamValues'
import { streamArray } from 'stream-json/streamers/StreamArray'

import { write, read, seed } from './util/migration.util'
import { templatize } from './templates/migration.tmpl'
import { connect } from './util/database.util'

let connection;
const messages = []
const args = minimist(process.argv.slice(2))
const versions = [{
  name: '4/6/2021 11:49:13 AM',
  rowCounts: {
    variables: 10510
  }  
}]



const updateProgress = (messages, note = 'Contemplating life...') => {
  let prog = ''
  let output = ''
  let rest = '           '.substring(0, (10 - messages.length))
  messages.map((msg) => { 
    prog += '='
    output += `\n\n          ✓ ${msg}`
  })
  console.clear()
  console.log(`\n\n\n   [${chalk.bgGreen(chalk.green(prog))}${rest}]\n\n\n          ${chalk.italic(chalk.blueBright(note))}`, `${chalk.green(output)}`)
}

const streamSource = (source: string, entity: string) => {
  return chain([
    fs.createReadStream(`./src/data/${source}.json`),
    parser(),
    pick({ filter: entity }),
    streamArray()
  ])
}


const dbinit = async() => {
  connection = await connect()
  //connection
  //process.exit(1)
  //dbinit()
}

const fileExists = (value: string):boolean => {
  return (!!!fs.existsSync(`./src/data/${value}.json`) && !!!fs.existsSync(`./src/data/${value}`)) ? false : true;
}

const isSupportedVersion = (source: string, action: (versionFound) => any):Promise<string | boolean> =>  {
  const pipe = chain([
    fs.createReadStream(`./src/data/${source}.json`),
    parser(),
    pick({ filter: 'version' })
  ])
  const stream = Asm.connectTo(pipe)
  return stream.on('done', version => {
    if(!!!versions.find(ver => ver.name === version.current)) {
      console.log(chalk.red(`Version unsuported -- Found: ${version.current}. Expecting one of: ${versions}`))
      return false
    } else {
      return action(version.current)
    }
  })
}

const exportEntity = async (source, entity, merge=true, action:(entity, id, data)=> void) => {
  let all = { }
  all[entity] = []
  const pipe = streamSource(source, entity)
  const stream = Asm.connectTo(pipe)
  const activity = ['◉','⧇','⦾','⦿','✿']
  let counter = 0
  let totalRows = 0
  pipe.on('data', (data) => {
    if(data.value.id % 7 === 0) {
      counter = (counter < 4) ? ++counter : 0
      let note = `${activity[counter]} Migrating ${chalk.italic(chalk.inverse(entity))} - row ${++totalRows}`
      if(entity === 'conversations') {
        note += '(BUCKLE UP, this step can take upwards of 5 minutes)'
      }
      updateProgress(messages, note)  
      if(merge === true) {
        all[entity].push(templatize(entity, data.value))
      } else {
        action(entity, data.value.id, templatize(entity, data.value))
      }
    }
  })

  pipe.on('end', () => {
    if(all[entity].length < 1) {
      console.log(chalk.red(`No entries found`))
      process.exit(1)
    }
    if(merge === true) {
      messages.push(`${entity} stream complete (read ${totalRows} rows)`, `Generating output...`)
      updateProgress(messages, 'end')
      action(entity, entity, all)
    }
  })
}

const exportEntities = (entities, file, output) => {
  entities.map(async (entity, i) => {
    updateProgress(messages, `* Reading ${entity}...`)  
    exportEntity(file, entity, true, (entityname, entityId, entityData) => {
      let filename
      switch(output) {
        case 'read':
          read(entityname, entityId, entityData)
          break
        case 'write':
          filename = write(entity, entityId, entityData, () => {
            messages.push(`Exporting ${entityname} data (${entityData[entity].length} entires) to ${filename} )......Success!`)
            updateProgress(messages)
            return
          })
          break
        case 'seed':
          filename = seed(entityname, entityId, entityData[entity])
          messages.push(`Exporting ${entityname} data (${entityData[entity].length} entires) to ${filename} )......Success!`)
          updateProgress(messages)
          break
        default:
          read(entityname, entityId, entityData)
          break
      }
    })
    if(i === entities.length) {
      console.log('okay i tired now')
      //process.exit(0)
    }
  })
}

// TODO, bring back option for calling exportEntity on a per-row basis.
const init = async () => {
  const output = (args['export'] === 'db') ? 'seed' : (args['export']) === 'json' ? 'write' : 'read' 

  const options:any = {}
  const entities = ['actors','locations'] //'actors','locations', 'variables','items','conversations'
  options.filename = 'dialog'

  updateProgress(messages, 'Do you even json?')
  if(!fileExists(options.filename)) {
    console.log(chalk.red(`Installation failed. Couldn't find "data/${options.filename}.json" file.`))
    process.exit(1)
  }

  messages.push(`${options.filename}.json file found. You did it! You showed up.`)
  updateProgress(messages)

  updateProgress(messages, 'Peeking under the hood for a valid version of data...')
  isSupportedVersion(options.filename, (version) => {
    messages.push(`Supported version found! ${JSON.stringify(version)}. Well done detective.`)
    updateProgress(messages, 'Opening Source Json...')

    exportEntities(entities, options.filename, output)
  })
}

init()