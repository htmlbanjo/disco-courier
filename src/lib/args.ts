import minimist from 'minimist2'
import chalk from 'chalk'

// TODO: switch to yargs or prompts and fix bug in option parsing.
//import yargs from 'yargs'
//import { hideBin } from 'yargs/helpers'

  const args = minimist(process.argv.slice(2))
  const outputMode = (args['export'] === 'db') ? 'seed' : (args['export'] === 'json') ? 'write' : 'read'
  const entityListDefaults = ['locations', 'actors', 'variables', 'items', 'conversations']
  const entityListAll = ['actors', 'actors.npc', 'actors.skill', 'actors.attribute',
                         'items', 'items.thought', 'items.key', 'items.drug',
                         'locations', 'locations.exterior', 'locations.interior',
                         'variables',
                         'conversations', 'conversations.task', 'conversations.check', 'conversations.dialog', 'conversations.hub']

  const setEntityList = ():string[] => {
    // TODO: LOW: populate entityList from an initial list tied to options.versions,
    // to support different keys across different versions
    if(!!!args['_'] || args['_'].length < 1) { return entityListDefaults }

    const userEntityList = args['_'].reduce((list:string[], arg:string) => {
      // longest entity is currently 13 (conversations), not concerned w/ exactness here.
      const str = arg
      const cleaned = str.trim().toLowerCase().substring(0, 25)
      if(entityListAll.includes(cleaned)) {
        list.push(cleaned)
        return list
      } else {
        console.log(chalk.red(`\n\n\nUnrecognized field: ${arg}.`))
        process.exit(1)
      }
      return list
    },[] as string[])
    return userEntityList
  }

  const setPaging = ():[number,number?] => {
    let paging:[number, number?] = [(Number.isNaN(args?.start)) ? parseInt(args?.start) : 0]
    if(Number.isNaN(args?.end)) { paging.push[parseInt(args?.end)] }
    return paging
  }

  export {
    outputMode,
    entityListDefaults,
    entityListAll,
    setEntityList,
    setPaging
  }