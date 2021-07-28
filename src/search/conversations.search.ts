import { TWithFields, IResultEntry } from '../defs/import'
import {
  keyFunction,
  valueOf,
  valueExistsInKey,
  cleanVariableName
} from './index.search'

const conversations = {
  taskActive (convo: TWithFields): IResultEntry {
    return keyFunction('display_condition_main', 'string', convo, {
      returnKey: 'taskActive',
      returnValueFn: cleanVariableName
    })
  },
  taskCompleted (convo: TWithFields): IResultEntry {
    return keyFunction('done_condition_main', 'string', convo, {
      returnKey: 'taskComplete',
      returnValueFn: cleanVariableName
    })
  },
  taskCancelled (convo: TWithFields): IResultEntry {
    return keyFunction('cancel_condition_main', 'string', convo, {
      returnKey: 'taskCanceled',
      returnValueFn: cleanVariableName
    })
  },
  taskReward (convo: TWithFields): IResultEntry {
    return keyFunction('taskReward', 'number', convo)
  },
  taskIsTimed (convo: TWithFields): IResultEntry {
    return keyFunction('taskTimed', 'boolean', convo)
  },
  getCheckType (convo: TWithFields): IResultEntry {
    return keyFunction('CheckType', 'number', convo, {
      returnKey: 'checkType'
    })
  },
  getCondition (convo: TWithFields): IResultEntry {
    return keyFunction('Condition', 'string', convo, {
      returnKey: 'condition',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getInstruction (convo: TWithFields): IResultEntry {
    return keyFunction('Instruction', 'string', convo, {
      returnKey: 'instruction',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getDifficulty (convo: TWithFields): IResultEntry {
    return keyFunction('Difficulty', 'number', convo, {
      returnKey: 'difficulty'
    })
  },
  getPlacement (convo: TWithFields): IResultEntry {
    return keyFunction('Placement', 'string', convo, {
      returnKey: 'placement'
    })
  },
  getActor (convo: TWithFields): IResultEntry {
    return keyFunction('Actor', 'number', convo, {
      returnKey: 'actorId'
    })
  },
  getConversant (convo: TWithFields): IResultEntry {
    return keyFunction('Conversant', 'number', convo, {
      returnKey: 'conversantId'
    })
  },
  getAltOrbText (convo: TWithFields): IResultEntry {
    return keyFunction('AlternateOrbText', 'string', convo, {
      returnKey: 'altOrbText'
    })
  },
  getOnUse (convo: TWithFields): IResultEntry {
    return keyFunction('OnUse', 'string', convo, {
      returnKey: 'onUse'
    })
  },
  getDialogOverride (convo: TWithFields): IResultEntry {
    return keyFunction('OverrideDialogueCondition', 'string', convo, {
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

const jumpsToHub = (convo: TWithFields): string => {
  const currTitle = valueOf('Title', convo)
  return currTitle
    ? currTitle.match(/^(Jump to: )\[(?<dest>\w+\s?\w+)\]/)?.groups?.dest
    : undefined
}
const isTerminalDialog = (convo: TWithFields): boolean => {
  return !!jumpsToHub(convo)
}

function getSubtaskCount (convo: TWithFields): number {
  let subtaskCount = 1
  convo?.fields?.map(field => {
    if (field.title.includes('subtask_title') && field.value) {
      ++subtaskCount
    }
  })
  return subtaskCount
}

const titleValueStartsWith = (search: string, convo: TWithFields): boolean => {
  const searchStr = new RegExp(`^${search}`)
  return !!valueOf('Title', convo)?.match(searchStr)
}
const titleValueEndsWith = (search: string, convo: TWithFields): boolean => {
  const searchStr = new RegExp(`${search}$`)
  return !!valueOf('Title', convo)?.match(searchStr)
}

const isATask = (convo: TWithFields): boolean => !!valueOf('task_reward', convo)

const hasASubtask = (convo: TWithFields): boolean =>
  !!valueOf('subtask_title_01', convo)

const isADoor = (convo: TWithFields): boolean =>
  valueExistsInKey(`\/ DOOR \/`, 'Title', convo)

const isAnOrb = (convo: TWithFields): boolean =>
  !!valueOf('Title', convo)?.match(/\bORB\b/)

const isAHub = (convo: TWithFields): boolean => {
  return !!valueOf('Title', convo)?.match(/HUB/i)
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
const isTask = (convo: TWithFields) => getSearchString('subtask_title', convo)
*/
