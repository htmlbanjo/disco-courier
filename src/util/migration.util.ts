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
function zeroPadded(value: number):string {
  return value.toString().padStart(2,'0')
}

function capitalize(entity: string):string {
  // entity arg gets the first letter uppercased to match model names
  // e.g. 'actors' key exports to an 'Actors' table.
  return `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`
}

/*****************************************************************
 * AS JSON
 *****************************************************************/
function jsonFileName(entity: string, file: string):string {
  confirmOrCreateDirectory(entity)
  return `./src/data/json/${entity}/${file}.json`
}

function writeStream(mode: 'write' | 'seed', entity: string, file: string):NodeJS.WritableStream  {
  let pathAndFilename
  try {
    pathAndFilename = (mode === 'seed') ? pathAndFilename = seedFileName(entity) : jsonFileName(entity,file)
    return fs.createWriteStream(pathAndFilename)
  } catch(err) {
    console.log(chalk.red(`Error writing file "${pathAndFilename}": ${err}`))
    chalk.italic(chalk.blueBright('Do we have permission to write files here?'))
    process.exit(1)
  }  
}

/*****************************************************************
 * AS SEQUELIZE SEEDER
 *****************************************************************/
function seedFileName (entity: string):string {
  const now = new Date()
  return `./src/data/seeders/${now.getUTCFullYear()}${zeroPadded(now.getUTCMonth() + 1)}${zeroPadded(now.getUTCDay())}${zeroPadded(now.getUTCHours())}${zeroPadded(now.getUTCMinutes())}${zeroPadded(now.getUTCSeconds())}-add-${entity}.js`
}

function seed(entity:string, data):string {
  // don't indent.
return `
'use-strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('${capitalize(entity)}', ${JSON.stringify(data, null, 2)}, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('${capitalize(entity)}', null, {})
  }
}
`
}

/*****************************************************************
 * AS TERMINAL OUTPUT
 *****************************************************************/
 const read = (entity, file, data) => {
  return () => {
    console.log(`--------------------------------------------------------\n`)
    console.log(`${chalk.bold(chalk.bgMagenta(` ENTITY: `))} ${chalk.magenta(entity)}\n`)
    console.log(`${chalk.bold(chalk.bgCyan(` FILENAME: `))} ${chalk.cyan(`${file}.json`)}\n`)
    console.log(`${chalk.bold(chalk.inverse(' DATA '))}:\n`)
    console.log(`--------------------------------------------------------\n`)
    console.dir(data, { depth: null})
    console.log(`_________________________________________________________`)
  }
}

export  {
  sourceFileExists,
  seedFileName,
  writeStream,
  read,
  seed
}