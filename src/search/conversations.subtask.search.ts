import { TWithFields } from '../defs/import'
import { getOptions } from '../lib/shared'
import { tableDates } from './index.search'

const options = getOptions()

function getSubtasks (item: TWithFields, returnType: 'string' | 'obj') {
  const stringify =
    !!(options.outputMode === 'mark' || options.outputMode === 'seed') &&
    returnType === 'string'

  //TODO: DRY up with existing search functions
  const st = {}

  // TODO: this is such an obvious scenario for reduce.
  item?.fields?.map(field => {
    if (field.title.includes('subtask_title_') && field.value) {
      const [taskHeading, taskNumber] = field.title.split('subtask_title_')
      st[taskNumber] = st[taskNumber] || { parentTaskId: item.id }
      st[taskNumber]['name'] = field.value
    }
    if (field.title.includes('display_subtask_') && field.value) {
      const [taskHeading, taskNumber] = field.title.split('display_subtask_')
      st[taskNumber] = st[taskNumber] || { parentTaskId: item.id }
      st[taskNumber]['active'] = field.value
    }
    if (field.title.includes('done_subtask_') && field.value) {
      const [taskHeading, taskNumber] = field.title.split('done_subtask_')
      st[taskNumber] = st[taskNumber] || { parentTaskId: item.id }
      st[taskNumber]['done'] = field.value
    }
    if (field.title.includes('cancel_subtask_') && field.value) {
      const [taskHeading, taskNumber] = field.title.split('cancel_subtask_')
      st[taskNumber] = st[taskNumber] || { parentTaskId: item.id }
      st[taskNumber]['cancel'] = field.value
    }

    if (field.title.includes('timed_subtask_') && field.value) {
      const [taskHeading, taskNumber] = field.title.split('timed_subtask_')
      if (taskNumber in st) {
        const result =
          field.value === 'true' || field.value === 'True' ? true : false
        st[taskNumber]['isTimed'] = result
      }
    }
  })
  Object.keys(st).map(sNum => {
    st[sNum] = { ...st[sNum], ...tableDates() }
  })

  return stringify ? JSON.stringify(Object.values(st)) : Object.values(st)
}

export { getSubtasks }
