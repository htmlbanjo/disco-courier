import fs from 'fs'
import chalk from 'chalk'

/*****************************************************************
 * AS JSON
 *****************************************************************/
const write = (entityname: string, file: string, data, action: () => void) => {
  // Common use case is "actors/actors.json" but supports "/actors/392.json" 
  // for e.g. a standalone entry containing INT_Rhetoric details.
  try {
    if (!fs.existsSync(`./src/data/json/${entityname}`)){
      fs.mkdirSync(`./src/data/json/${entityname}`)
    }
    fs.writeFile(`./src/data/json/${entityname}/${file}.json`, JSON.stringify(data, null, 2), 'utf8', action)
  } catch(err) {
    console.log(chalk.red(`Error writing file "data/json/${entityname}/${file}.json": ${err}`))     
  }
}

/*****************************************************************
 * AS SEQUELIZE SEEDER
 *****************************************************************/
const zeroPadded = (value: number):string => {
  return value.toString().padStart(2,'0')
}
const seederFileName = (entity: string):string => {
  const now = new Date()
  return `${now.getUTCFullYear()}${zeroPadded(now.getUTCMonth() + 1)}${zeroPadded(now.getUTCDay())}${zeroPadded(now.getUTCHours())}${zeroPadded(now.getUTCMinutes())}${zeroPadded(now.getUTCSeconds())}-add-${entity}.js`
}
const seederFile = (entity:string, data):string => {
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
  const filename:string = seederFileName(entity)
  try {
    fs.writeFileSync(`src/data/seeders/${filename}`, seederFile(entity, data), 'utf8')
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
  write,
  read,
  seed
}