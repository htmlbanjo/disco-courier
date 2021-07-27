import { TWithFields, IResultEntry } from '../defs/import'
import {
  keyFunction,
  valueOf,
  valueExistsInKey,
  cleanVariableName
} from './index.search'

const conversations = {
  taskActive (item: TWithFields): IResultEntry {
    return keyFunction('display_condition_main', 'string', item, {
      returnKey: 'taskActive',
      returnValueFn: cleanVariableName
    })
  },
  taskCompleted (item: TWithFields): IResultEntry {
    return keyFunction('done_condition_main', 'string', item, {
      returnKey: 'taskComplete',
      returnValueFn: cleanVariableName
    })
  },
  taskCancelled (item: TWithFields): IResultEntry {
    return keyFunction('cancelConditionMain', 'string', item, {
      returnKey: 'taskCanceled',
      returnValueFn: cleanVariableName
    })
  },
  taskReward (item: TWithFields): IResultEntry {
    return keyFunction('taskReward', 'number', item)
  },
  taskIsTimed (item: TWithFields): IResultEntry {
    return keyFunction('taskTimed', 'boolean', item)
  },
  getCheckType (item: TWithFields): IResultEntry {
    return keyFunction('CheckType', 'string', item, {
      returnKey: 'checkType'
    })
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

export {
  conversations,
  getSubtaskCount,
  titleValueStartsWith,
  titleValueEndsWith,
  isATask,
  hasASubtask,
  isADoor,
  isAnOrb,
  isAHub,
  jumpsToHub,
  isTerminalDialog
}

/*
const isTask = (item: TWithFields) => getSearchString('subtask_title', item)
*/
