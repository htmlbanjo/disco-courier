import minimist from 'minimist2'
import chalk from 'chalk'

// TODO: switch to yargs or prompts and fix bug in option parsing.
//import Yargs from 'yargs'
//import { hideBin } from 'yargs/helpers'

const args = minimist(process.argv.slice(2))

const outputMode =
  args['export'] === 'db'
    ? 'seed'
    : args['export'] === 'json'
    ? 'write'
    : args['export'] === 'md'
    ? 'mark'
    : 'read'

const entityListDefaults = [
  'locations',
  'actors',
  'variables',
  'items',
  'conversations'
]
const entityListAll = [
  'actors',
  'actors.npc',
  'actors.skill',
  'actors.lookup',
  'actors.attribute',
  'items',
  'items.thought',
  'items.key',
  'items.substance',
  'items.consumable',
  'items.game',
  'items.book',
  'items.clothing',
  'items.tare',
  'locations',
  'variables',
  'conversations',
  'conversations.task',
  'conversations.subtask',
  'conversations.dialog',
  'conversations.orb',
  'conversations.check',
  'conversations.passivecheck',
  'conversations.whitecheck',
  'conversations.redcheck',
  'conversations.link'
]

const setEntityList = (): string[] => {
  // TODO: LOW: populate entityList from an initial list tied to options.versions,
  // to support different keys across different versions
  if (!!!args['_'] || args['_'].length < 1) {
    return entityListDefaults
  }
  const userEntityList = args['_'].reduce((list: string[], arg: string) => {
    const str = arg
    const cleaned = str
      .trim()
      .toLowerCase()
      .substring(0, 30)
    // note on "30" above: longest entity is currently 13 (conversations), not concerned w/ exactness here.
    if (entityListAll.includes(cleaned)) {
      list.push(cleaned)
      return list
    } else {
      console.log(
        `${chalk.bgRed(
          chalk.bold(`\n\n\n Unrecognized field: `)
        )} ${chalk.redBright(arg)}`
      )

      process.exit(1)
    }
    return list
  }, [] as string[])
  return userEntityList
}

const setPaging = (): [number, number?] => {
  let paging: [number, number?] = [
    !Number.isNaN(parseInt(args?.start)) ? parseInt(args.start) : 0
  ]
  if (!Number.isNaN(parseInt(args?.results))) {
    paging.push(parseInt(args.results))
  }
  return paging
}

export {
  outputMode,
  entityListDefaults,
  entityListAll,
  setEntityList,
  setPaging
}
