import fs from 'fs'
import chalk from 'chalk'

import { parser } from 'stream-json'
import { chain } from 'stream-chain'
import { pick } from 'stream-json/filters/Pick'
import { ignore } from 'stream-json/filters/Ignore'
import { streamArray } from 'stream-json/streamers/StreamArray'
import { streamValues } from 'stream-json/streamers/StreamValues'

import { templatize } from '../templates'
import { ISupportedVersion } from '../defs/import'
import { getMessageText } from '../lib/out'
import { updateProgress } from '../lib/progress'
import { getOptions } from '../lib/shared'

const options = getOptions()

function versionList (supportedVersions: ISupportedVersion[]): string {
  return supportedVersions
    .reduce((versions: string[], v: ISupportedVersion) => {
      versions.push(v.version)
      return versions
    }, [] as string[])
    .join(', ')
}

const isSupportedVersion = (
  source: string,
  supportedVersionList: ISupportedVersion[],
  action: (matchedVersion) => void
) => {
  const pipe = chain([
    fs.createReadStream(`./src/data/${source}.json`),
    parser(),
    pick({ filter: 'version' }),
    streamValues(),
    data =>
      supportedVersionList.find(entry => entry.version === data.value) || false
  ])
  pipe.on('data', data => {
    if (!!data?.version) {
      action(data)
    } else {
      console.log(
        getMessageText().versionUnsupported(versionList(supportedVersionList))
      )
      process.exit(0)
    }
  })
}

/* TODO - we should be able to GREATLY speed up paging
 * for high --start values by moving it from index's entity parser
 * to the data method here. It'll require a decent sized rewrite
 * of paging however.
 */
const streamSource = (source: string, entity: string, defaults: string[]) => {
  const [entityParent, entitySubProcess] = entity.split('.')
  const ignoreExpression = buildIgnoreExpression(
    entityParent,
    entitySubProcess,
    defaults
  )
  let streamcount = 1
  return chain([
    fs.createReadStream(`./src/data/${source}.json`),
    parser(),
    pick({ filter: entityParent, once: true }),
    ignore({ filter: ignoreExpression, once: true }),
    streamArray(),
    data => {
      ++streamcount
      updateProgress(
        `${getMessageText().processingLoop(
          entity,
          streamcount
        )} >> ${chalk.yellowBright(streamcount)} ${chalk.yellow(
          data?.value?.fields[0]?.value
        )}`
      )
      return templatize(entity, data.value) || false
    }
  ])
}

function buildIgnoreExpression (
  entityParent: string,
  entitySubProcess: string,
  defaults: string[]
): RegExp {
  const indexOfEntityInEntities = defaults.findIndex(e => e === entityParent)
  const ignoreList = [...defaults]
  ignoreList.splice(indexOfEntityInEntities, 1)
  if (entitySubProcess !== 'dialog') {
    ignoreList.push('dialogueEntries')
  }
  return new RegExp(`\\b${ignoreList.join('\\b|\\b')}\\b`)
}

function sourceFileExists (value: string): boolean {
  return !!!fs.existsSync(`./src/data/${value}.json`) &&
    !!!fs.existsSync(`./src/data/${value}`)
    ? false
    : true
}

function confirmOrCreateDirectory (dirName: string): void {
  try {
    if (!fs.existsSync(`./src/data/json/${dirName}`)) {
      fs.mkdirSync(`./src/data/json/${dirName}`)
    }
  } catch (err) {
    console.log(getMessageText().failedToCreateDirectory(dirName, err))
    process.exit(1)
  }
}
function zeroPadded (value: number): string {
  return value.toString().padStart(2, '0')
}

function formatTableName (entity: string): string {
  entity = entity.split('.').join('_')
  // entity arg gets the first letter uppercased to match model names
  // e.g. 'actors' key exports to an 'Actors' table.
  return `${entity.charAt(0).toUpperCase()}${entity.slice(1)}`
}

/*****************************************************************
 * AS JSON
 *****************************************************************/
function jsonFileName (entity: string, file: string): string {
  confirmOrCreateDirectory(entity)
  return `./src/data/json/${entity.split('.')[0]}/${file}.json`
}

function writeStream (
  mode: 'write' | 'seed' | 'read',
  entity: string,
  file: string
): NodeJS.WritableStream {
  if (mode === 'read') {
    return
  }
  let pathAndFilename
  try {
    pathAndFilename =
      mode === 'seed'
        ? (pathAndFilename = seedFileName(entity))
        : jsonFileName(entity, file)
    return fs.createWriteStream(pathAndFilename)
  } catch (err) {
    console.log(chalk.red(`Error writing file "${pathAndFilename}": ${err}`))
    chalk.italic(chalk.blueBright('Do we have permission to write files here?'))
    process.exit(1)
  }
}

/*****************************************************************
 * AS SEQUELIZE SEEDER
 *****************************************************************/
function seedFileName (entity: string): string {
  const now = new Date()
  return `./src/data/seeders/${now.getUTCFullYear()}${zeroPadded(
    now.getUTCMonth() + 1
  )}${zeroPadded(now.getUTCDay())}${zeroPadded(now.getUTCHours())}${zeroPadded(
    now.getUTCMinutes()
  )}${zeroPadded(now.getUTCSeconds())}-add-${entity}.js`
}

function seed (entity: string, data): string {
  // don't indent.
  return `
'use-strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('${formatTableName(
      entity
    )}', ${JSON.stringify(data, null, 2)}, {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('${formatTableName(entity)}', null, {})
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
    console.log(
      `${chalk.bold(chalk.bgMagenta(` ENTITY: `))} ${chalk.magenta(entity)}\n`
    )
    console.log(`${chalk.bold(chalk.bgCyan(' DATA '))}:\n`)
    console.dir(data, { depth: null })
    console.log(`_________________________________________________________`)
  }
}

export {
  versionList,
  isSupportedVersion,
  streamSource,
  sourceFileExists,
  seedFileName,
  writeStream,
  read,
  seed
}
