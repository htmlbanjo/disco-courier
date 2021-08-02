import fs, { createReadStream, ReadStream } from 'fs'
import chalk from 'chalk'
import tablemark from 'tablemark'
import { parser } from 'stream-json'
import { chain } from 'stream-chain'
import { pick } from 'stream-json/filters/Pick'
import { ignore } from 'stream-json/filters/Ignore'
import { streamArray } from 'stream-json/streamers/StreamArray'
import { streamValues } from 'stream-json/streamers/StreamValues'

import { templatize } from '../templates'
import { ISupportedVersion } from '../defs/import'
import { messageText, activityIndicatorList } from '../lib/out'
import { updateProgress } from '../lib/progress'
import { getOptions, getState, setState } from '../lib/shared'

import {
  getParentEntity,
  getEntityGroup,
  entityArgsContainConvo,
  entityArgsContainNonConvo,
  getActorConversantOrBothFilter
} from '../lib/args'

/* TODO: File needs some breaking up */

const options = getOptions()

function versionList (supportedVersions: ISupportedVersion[]): string {
  return supportedVersions
    .reduce((versions: string[], v: ISupportedVersion) => {
      versions.push(v.version)
      return versions
    }, [] as string[])
    .join(', ')
}

function isSupportedVersion (
  source: string,
  supportedVersionList: ISupportedVersion[],
  action: (matchedVersion) => void
) {
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
      pipe.destroy()
    } else {
      console.log(
        messageText.versionUnsupported(versionList(supportedVersionList))
      )
      process.exit(0)
    }
  })
}

function writeStream (
  mode: 'write' | 'seed' | 'read' | 'mark' | 'cache',
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
        : mode === 'mark'
        ? (pathAndFilename = mdFileName(entity))
        : mode === 'write'
        ? jsonFileName(entity, file)
        : cacheFileName(entity, file)
    return fs.createWriteStream(pathAndFilename)
  } catch (err) {
    console.log(chalk.red(`Error writing file "${pathAndFilename}": ${err}`))
    chalk.italic(chalk.blueBright('Do we have permission to write files here?'))
    process.exit(1)
  }
}

function processActorPipe (
  pipe: ReadStream,
  lookupExists: boolean,
  callback: (response) => void
) {
  let totalRows = 0
  const actors = []
  pipe.on('data', data => {
    ++totalRows
    actors.push(data)
    if (totalRows === getState('currentVersion')?.rowCounts['actors']) {
      callback(actors)
      pipe.destroy()
    }
  })
}

// create a compact actors reference on first run
function getOrCreateLookup () {
  const lookupExists = !!fs.existsSync(`./src/data/cache/actors.cache.json`)
  let pipe
  if (lookupExists) {
    pipe = chain([
      fs.createReadStream(`./src/data/cache/actors.cache.json`),
      parser(),
      pick({ filter: 'cache_actors' }),
      streamValues(),
      data => data.value
    ])
  } else {
    pipe = streamSource(options.sourceJSON, 'actors.cache')
  }
  processActorPipe(pipe, lookupExists, function (response) {
    setState('cache', { ...getState('cache'), actors: response })
    if (!!!lookupExists) {
      writeStream('cache', 'actors.cache', 'actors.cache').write(
        JSON.stringify({ cache_actors: response }, null, 2)
      )
    }
  })
}

const findScopedItemInArgs = (scope: string, item: string, memo = {}) => {
  const scopeFn = scope === 'entity' ? getParentEntity : getEntityGroup
  return memo[item]
    ? memo[item]
    : (memo[item] = options.entityList.find(li => scopeFn(li) === item))
}

// The intent here is to favor actor over other options unless
// --conversant is used explicitly.
const getActorOrConversantFlag = (): string => {
  return getState('conversant')
    ? 'conversant'
    : getState('actor')
    ? 'actor'
    : undefined
}

const checkAndThrowNoArgTarget = flag => {
  if (!getState('hasConversations') && flag) {
    throw new Error(messageText.noConversationForActorOrConversant(flag))
  }
}

const checkAndSetMixedOutputMsg = (flag: string): void => {
  if (getState('hasConversations') && getState('hasNonConversations') && flag) {
    setState(
      'mixedOutput',
      `${getState('mixedOutput') || ''}
       ${messageText.mixedEntitiesWithActorOrConversant(flag)}`
    )
  }
}

const checkAndSetTepidOutcomeMsg = (flag: string): void => {
  // TODO: we could really use to memoize entity.split('.')[0] in a getParentEntity function.
  if (findScopedItemInArgs('group', 'passivecheck') && getState('conversant')) {
    setState(
      'mixedOutput',
      `${getState('mixedOutput') || ''}
       ${messageText.conversantOnCheckItems()}`
    )
  }
}

const setActorFilters = () => {
  setState('filters', {
    actorFilters: {
      actorId: getActorConversantOrBothFilter('actor'),
      convId: getActorConversantOrBothFilter('conversant')
    }
  })
}

const actorConversantArgsSanityCheck = () => {
  /*  Potential messaging around some context for those filters, if they're used questionably:
   * e.g. if we're filtering for actors on a "conversation" search, but also requesting "items,"
   * where actors aren't applicable, we should note that in the results to manage expectations.
   *
   * If no conversation is in the entities list but we're trying to filter by actor or convesant
   * We should crash with an explicit reason why.
   *
   * TODO: this is shaping up to be a routing / switchboard for arg-related messages
   * should consider refactoring accordingly as it grows.
   */
  setState('hasConversations', entityArgsContainConvo(options.entityList))
  setState('hasNonConversations', entityArgsContainNonConvo(options.entityList))

  let flag = getActorOrConversantFlag()

  checkAndThrowNoArgTarget(flag)
  checkAndSetMixedOutputMsg(flag)
  checkAndSetTepidOutcomeMsg(flag)
  return true
}

/* TODO - we could speed up paging in cases
 * where the --start arg is with a high number (e.g. --start=628)
 * by moving paging logic from the index.ts parseEntities() function and
 * into the data method below. That effort will require a significant rewrite
 * of paging however.
 */
const streamSource = (source: string, entity: string) => {
  const [entityParent, entitySubProcess] = entity.split('.')
  const ignoreExpression = buildIgnoreExpression(entityParent, entitySubProcess)
  let streamcount = 1
  let counter = 0
  return chain([
    fs.createReadStream(`./src/data/${source}.json`),
    parser(),
    pick({ filter: entityParent, once: true }),
    ignore({ filter: ignoreExpression, once: true }),
    streamArray(),
    data => {
      // modulo to prevent excess screen flashing on smaller entities.
      // don't even bother for locations - we're done before anyone will see it.
      if (
        (entityParent === 'variables' && streamcount % 50 === 0) ||
        (entityParent === 'items' && streamcount % 10 === 0) ||
        (entityParent === 'actors' && streamcount % 10 === 0) ||
        entityParent === 'conversations'
      ) {
        counter = counter < activityIndicatorList.length - 1 ? ++counter : 0

        if (entitySubProcess === 'cache') {
          updateProgress(
            `${messageText.firstTimeSetup(counter)} >> ${chalk.yellowBright(
              streamcount
            )} ${chalk.yellow(data?.value?.fields[0]?.value)}`
          )
        }

        updateProgress(
          `${messageText.processingLoop(
            entity,
            counter
          )} >> ${chalk.yellowBright(streamcount)} ${chalk.yellow(
            data?.value?.fields[0]?.value
          )}`
        )
      }
      ++streamcount
      return templatize(entity, data.value) || false
    }
  ])
}

function buildIgnoreExpression (
  entityParent: string,
  entitySubProcess: string
): RegExp {
  const indexOfEntityInEntities = options.entityListDefaults.findIndex(
    e => e === entityParent
  )
  const ignoreList = [...options.entityListDefaults]
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

function confirmOrCreateDirectory (section: string, dirName: string): void {
  try {
    if (!fs.existsSync(`./src/data/${section}/${dirName}`)) {
      fs.mkdirSync(`./src/data/${section}/${dirName}`)
    }
  } catch (err) {
    throw new Error(messageText.failedToCreateDirectory(dirName, err))
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
 * AS CACHE FILES
 *****************************************************************/
function cacheFileName (entity: string, file: string): string {
  const directory = entity.split('.')[0]
  // TODO: refactor confirmOrCreateDirectory to DRY this up.
  try {
    if (!fs.existsSync(`./src/data/cache/`)) {
      fs.mkdirSync(`./src/data/cache`)
    }
  } catch (err) {
    throw new Error(
      messageText.failedToCreateDirectory('./src/data/cache', err)
    )
  }
  return `./src/data/cache/${file}.json`
}

/*****************************************************************
 * AS JSON
 *****************************************************************/
function jsonFileName (entity: string, file: string): string {
  const directory = entity.split('.')[0]
  confirmOrCreateDirectory('json', directory)
  return `./src/data/json/${directory}/${file}.json`
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
 * AS A MARKDOWN TABLE
 *****************************************************************/

function mdFileName (entity: string): string {
  const directory = getParentEntity(entity)
  confirmOrCreateDirectory('markdown', directory)
  return `./src/data/markdown/${directory}/${entity}.md`
}
function mark (entity: string, data): string {
  const [entityName, groupName] = entity.split('.')
  return `
  Results for ${entityName} 
  ==
  (filtered by: ${groupName})
  ---
  _${data.length} entries pulled out of the SSSSOUPED UP MOTOR CARRIAGE._

  ${tablemark(data)}

  * _driven steadily through the pale by [Disco-Courier](https://github.com/htmlbanjo/disco-courier)_
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
  getOrCreateLookup,
  setActorFilters,
  actorConversantArgsSanityCheck,
  streamSource,
  sourceFileExists,
  seedFileName,
  mdFileName,
  writeStream,
  read,
  seed,
  mark
}
