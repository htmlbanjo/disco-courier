import { getState } from '../lib/shared'
import { filterVerb } from '../lib/args'
import { numericValueOf } from './index.search'
import chalk from 'chalk'
function applyActorFilters (entry) {
  const f = getState('filters').actorFilters
  const fLength = Object.values(f).filter(e => e).length

  // no filters to apply.
  if (fLength < 1) {
    return entry
  }

  const c = {
    actorId: numericValueOf('Actor', entry),
    convId: numericValueOf('Conversant', entry)
  }

  const filterFnList = {
    actorId () {
      return !!c.actorId ? c.actorId === f.actorId : undefined
    },
    convId () {
      return !!c.convId ? c.convId === f.convId : undefined
    }
  }

  // TODO: AND.
  const fActions = {
    or: () => {
      return Object.keys(filterFnList)
        .reduce((results: boolean[], fName: string) => {
          results.push(filterFnList[fName]())
          return results
        }, [] as boolean[])
        .find((res: boolean) => {
          res === true
        })
    },
    one: () => this.or(),
    and: () => {
      const resultsMatchingTrue = Object.keys(filterFnList)
        .reduce((results: boolean[], fName: string) => {
          if (f[fName]) {
            // if key is in supplied args, run the compatibly-named filter function
            results.push(filterFnList[fName]())
          }
          return results
        }, [] as boolean[])
        .filter(res => res)
      return resultsMatchingTrue.length === fLength
    }
  }

  return fActions[filterVerb]()
}

export { applyActorFilters }
