import {
  TWithFields,
  IResultEntry,
  TKeyOutputFunction,
  IKeyFunctionOption
} from '../defs/import'
import {
  keyFunction,
  valueOf,
  titleIs,
  gameId,
  titleContains,
  whereKeyContains,
  valueExistsInKey,
  cleanVariableName,
  cleanVariableNameNoPrefix
} from './index.search'

const conversations = {
  taskActive (item: TWithFields): IResultEntry {
    return keyFunction('display_condition_main', 'string', item, {
      returnKey: 'task_active_variable',
      returnValueFn: cleanVariableName
    })
  },
  taskCompleted (item: TWithFields): IResultEntry {
    return keyFunction('done_condition_main', 'string', item, {
      returnKey: 'task_complete_variable',
      returnValueFn: cleanVariableName
    })
  },
  taskCancelled (item: TWithFields): IResultEntry {
    return keyFunction('cancel_condition_main', 'string', item, {
      returnKey: 'task_canceled_variable',
      returnValueFn: cleanVariableName
    })
  },
  taskReward (item: TWithFields): IResultEntry {
    return keyFunction('task_reward', 'number', item)
  },
  taskIsTimed (item: TWithFields): IResultEntry {
    return keyFunction('task_timed', 'boolean', item)
  },
  getCheckType (item: TWithFields): IResultEntry {
    return keyFunction('CheckType', 'string', item)
  },
  getCondition (item: TWithFields): IResultEntry {
    return keyFunction('Condition', 'string', item, {
      returnKey: 'condition',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getInstruction (item: TWithFields): IResultEntry {
    return keyFunction('Instruction', 'string', item, {
      returnKey: 'instruction',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getDifficulty (item: TWithFields): IResultEntry {
    return keyFunction('Difficulty', 'number', item, {
      returnKey: 'difficulty'
    })
  },
  getPlacement (item: TWithFields): IResultEntry {
    return keyFunction('Placement', 'string', item, {
      returnKey: 'placement'
    })
  },
  getActor (item: TWithFields): IResultEntry {
    return keyFunction('Actor', 'number', item, {
      returnKey: 'actorId'
    })
  },
  getConversant (item: TWithFields): IResultEntry {
    return keyFunction('Conversant', 'number', item, {
      returnKey: 'conversantId'
    })
  },
  getAltOrbText (item: TWithFields): IResultEntry {
    return keyFunction('AlternateOrbText', 'string', item, {
      returnKey: 'altOrbText'
    })
  },
  getOnUse (item: TWithFields): IResultEntry {
    return keyFunction('OnUse', 'string', item)
  },
  getDialogOverride (item: TWithFields): IResultEntry {
    return keyFunction('OverrideDialogueCondition', 'string', item, {
      returnKey: 'dialogOverrideCondition'
    })
  }
}

// runs a cleanVariablename-like regex, but greedy across entire condition.
const cleanVariablesInCondition = <TKeyOutputFunction>(
  value: string
): string => {
  return value
    ? value.replace(/Variable\[\"([A-Za-z]+.\w+)\"\]/g, `$1`)
    : undefined
}

/* splits on all conditions to provide a list of every condition
 * minus operators and logic, for quick lookup */
const cleanedConditionListAsArray = <TKeyOutputFunction>(
  value: string
): string[] => {
  return value
    ? cleanVariablesInCondition(value).split(/\s?==|\band\b|\or\b|;\s?/)
    : undefined
}

const jumpsToHub = (item: TWithFields): string => {
  const currTitle = valueOf('Title', item)
  return currTitle
    ? currTitle.match(/^(Jump to: )\[(?<dest>\w+\s?\w+)\]/)?.groups?.dest
    : undefined
}
const isTerminalDialog = (item: TWithFields): boolean => {
  return !!jumpsToHub(item)
}

function getSubtaskCount (item: TWithFields): number {
  let subtaskCount = 1
  item?.fields?.map(field => {
    if (field.title.includes('subtask_title') && field.value) {
      ++subtaskCount
    }
  })
  return subtaskCount
}

function getSubtasks (item: TWithFields) {
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
  // TODO: really, really obvious...
  return Object.values(st)
}

/* TODO: a rollup version that preserves the graph,
 * for use with noSQL or de-normalized projects */
function getNormalizedDialogEntries (item: TWithFields) {
  const dialogRows = item?.dialogueEntries?.reduce(
    (entries: IResultEntry[], entry: TWithFields) => {
      entry.outgoingLinks.map(row => {
        entries.push({
          parentId: item.id,
          internalId: entry.id,
          gameId: gameId(item),
          name: valueOf('Title', entry),
          isRoot: entry.isRoot,
          isGroup: entry.isGroup,
          conditionPriority: entry.conditionPriority,
          conditionString: entry.conditionString,
          userScript: entry.userScript,
          originConversationId: row.originConversationID,
          originDialogId: row.originDialogueID,
          destinationConversationId: row.destinationConversationID,
          destinationDialogId: row.destinationDialogID,
          isConnector: row.isConnector,
          priority: row.priority,
          InputId: valueOf('InputId', entry),
          OutputId: valueOf('OutputId', entry),
          sequence: valueOf('Sequence', entry)
        })
      })
      return entries
    },
    [] as IResultEntry[]
  )
  return dialogRows
}

const titleValueStartsWith = (search: string, item: TWithFields): boolean => {
  const searchStr = new RegExp(`^${search}`)
  return !!valueOf('Title', item)?.match(searchStr)
}
const titleValueEndsWith = (search: string, item: TWithFields): boolean => {
  const searchStr = new RegExp(`${search}$`)
  return !!valueOf('Title', item)?.match(searchStr)
}

const isATask = (item: TWithFields): boolean => !!valueOf('task_reward', item)

const hasASubtask = (item: TWithFields): boolean =>
  !!valueOf('subtask_title_01', item)

const isADoor = (item: TWithFields): boolean =>
  valueExistsInKey(`\/ DOOR \/`, 'Title', item)

const isAnOrb = (item: TWithFields): boolean =>
  !!valueOf('Title', item)?.match(/\bORB\b/)

const isAHub = (item: TWithFields): boolean => {
  return !!valueOf('Title', item)?.match(/HUB/i)
}

const isACheck = (item: TWithFields): boolean => {
  return !!valueOf('Title', item).match(/Variable\[\"([A-Za-z]+.\w+)\"\]/)
}

export {
  conversations,
  getSubtaskCount,
  getSubtasks,
  titleValueStartsWith,
  titleValueEndsWith,
  isATask,
  hasASubtask,
  isADoor,
  isAnOrb,
  isAHub,
  isACheck,
  jumpsToHub,
  isTerminalDialog,
  getNormalizedDialogEntries
}

/*
const isTask = (item: TWithFields) => getSearchString('subtask_title', item)
*/
