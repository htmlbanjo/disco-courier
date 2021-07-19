import fs from 'fs'
import chalk from 'chalk'


function sourceFileExists(value: string):boolean {
  return (!!!fs.existsSync(`./src/data/${value}.json`) && !!!fs.existsSync(`./src/data/${value}`)) ? false : true
}

function confirmOrCreateDirectory(dirName: string):void {
  try {
    if (!fs.existsSync(`./src/data/json/${dirName}`)){
      fs.mkdirSync(`./src/data/json/${dirName}`)
    }
  } catch(err) {
    console.log(chalk.red(`Error creating directory ./src/data/json/${dirName}. do you have the correct permissions? ${err}`))
    process.exit(1)
  }
}

/*****************************************************************
 * AS JSON
 *****************************************************************/
function jsonHeader(entity:string):string {
  return `
{
  "${entity}": [
`
}

function jsonFooter():string {
  return `
  ]
}`
}

function write(entity: string, file: string, data, action: () => void) {
  // Common use case is "actors/actors.json" but supports "/actors/392.json" 
  // for e.g. a standalone entry containing INT_Rhetoric details.
  try {
    confirmOrCreateDirectory(entity)
    fs.writeFile(`./src/data/json/${entity}/${file}.json`, JSON.stringify(data, null, 2), 'utf8', action)
  } catch(err) {
    console.log(chalk.red(`Error writing file "data/json/${entity}/${file}.json": ${err}`))     
  }
}

function writeStream(entity: string, file: string):NodeJS.WritableStream  {
  try {
    confirmOrCreateDirectory(entity)
    return fs.createWriteStream(`./src/data/json/${entity}/${file}.json`)
  } catch(err) {
    console.log(chalk.red(`Error writing file "data/json/${entity}/${file}.json": ${err}`))
    process.exit(1)
  }  
}

/*****************************************************************
 * AS SEQUELIZE SEEDER
 *****************************************************************/
const zeroPadded = (value: number):string => {
  return value.toString().padStart(2,'0')
}

const seedFileName = (entity: string):string => {
  const now = new Date()
  return `${now.getUTCFullYear()}${zeroPadded(now.getUTCMonth() + 1)}${zeroPadded(now.getUTCDay())}${zeroPadded(now.getUTCHours())}${zeroPadded(now.getUTCMinutes())}${zeroPadded(now.getUTCSeconds())}-add-${entity}.js`
}

const seedHeader = (entity:string, data):string => {
  // entity arg gets the first letter uppercased to match model names
  // e.g. 'actors' key exports to an 'Actors' table.
  const table:string = `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`
  // don't indent.
return `
'use-strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('${table}', ${JSON.stringify(data, null, 2)}, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('${table}', null, {})
  }
}
`
}

/* Writes a Sequelize seeder file into the seeder directory, 
   using data imported from the dialog file. */
const seed = (entity: string, id:number, data):string | void => {
  const filename:string = seedFileName(entity)
  try {
    fs.writeFileSync(`src/data/seeders/${filename}`, seedHeader(entity, data), 'utf8')
    return filename
  } catch(err) {
    console.log(
      chalk.red(`Error writing seeder file #${id}: "src/data/seeders/${filename}": ${err}\n`),
      chalk.italic(chalk.blueBright('Do we have permission to write files here?'))
    )
    process.exit(1)
  }
}

/*****************************************************************
 * AS TERMINAL OUTPUT
 *****************************************************************/
 const read = (entity, file, data) => {
  // TODO: chalk it up!
  console.log('--------------------------------------------------------')
  console.log(`${chalk.inverse(`entity:`)} ${chalk.yellow(entity)} \n ${chalk.inverse(`filename:`)} ${chalk.cyan(`${file}.json`)} \n ${chalk.inverse(data)}: `)
  console.log('--------------------------------------------------------')
  console.dir(data, {depth: null})
  console.log('_________________________________________________________')
}

export  {
  sourceFileExists,
  seedFileName,
  seedHeader,
  jsonHeader,
  jsonFooter,
  write,
  writeStream,
  read,
  seed
}