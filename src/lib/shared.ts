import produce, { castDraft } from 'immer'
import {
  outputMode,
  setEntityList,
  entityListDefaults,
  setPaging
} from './args'
import { ISupportedVersion } from '../defs/import'

/*
 * OPTIONS
 * debug true: doesn't clear console output
 * entityList: array of entities to export, e.g. ['locations','actors'] derived from args or a basic default.
 * entityListDefaults - base list with no sub-processes.
 * paging: a limit,offset array for number of results, e.g. paging=[9,3] returns 3 results from 9th entry (1-indexed).
 * merge: collect every row for an entity into a single file, or generate every row as a new file.
 * ------- CAUTION: setting MERGE to FALSE on e.g. "conversations" without a paging option will generate thousands of files.
 * outputMode: derived from args, how to output the result: as json data, as a sequelize seeder file, or just log to console.
 * sourceJSON: hardcoded for now, needs a ./src/data/dialog.json file.
 * supportedVersions: list of versions to support along with array lengths for optimization.
 *
 */
const options = {
  debug: <boolean>false,
  entityListDefaults: entityListDefaults,
  entityList: <string[]>setEntityList(),
  paging: <[number, number?]>setPaging(),
  merge: <boolean>true,
  outputMode: <'read' | 'seed' | 'write' | 'mark'>outputMode,
  sourceJSON: <string>'dialog',
  supportedVersions: <ISupportedVersion[]>[
    {
      version: <string>'4/6/2021 11:49:13 AM',
      rowCounts: {
        locations: <number>2,
        actors: <number>420,
        items: <number>258,
        variables: <number>10510,
        conversations: <number>1428
      }
    }
  ]
}

// TODO: improve past a bare minimum
const initialState = {
  start: Date.now(),
  messages: [],
  output: [],
  currentVersion: {
    version: false
  }
}

let state = initialState

const getOptions = () => {
  return { ...options }
}

const getState = (key?: string) => {
  return key === undefined ? state : state[key]
}

const setState = (key, next) => {
  state = produce(state, _draft => {
    _draft[key] = castDraft(next)
    return _draft
  })
}

export { getOptions, getState, setState }
