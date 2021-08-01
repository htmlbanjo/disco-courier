import {
  TWithFields,
  IResultEntry,
  IResultEntryString,
  IResultEntryNumber,
  IResultEntryBoolean
} from '../defs/import'
import {
  keyFunction,
  getStringEntry,
  getNumberEntry,
  getBooleanEntry,
  valueOf,
  valueExistsInKey,
  cleanVariableName
} from './index.search'

const conversations = {
  taskActive (convo: TWithFields): IResultEntryString {
    return getStringEntry('display_condition_main', convo, {
      returnKey: 'taskActive',
      returnValueFn: cleanVariableName
    })
  },
  taskCompleted (convo: TWithFields): IResultEntryString {
    return getStringEntry('done_condition_main', convo, {
      returnKey: 'taskComplete',
      returnValueFn: cleanVariableName
    })
  },
  taskCancelled (convo: TWithFields): IResultEntryString {
    return getStringEntry('cancel_condition_main', convo, {
      returnKey: 'taskCanceled',
      returnValueFn: cleanVariableName
    })
  },
  taskReward (convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('taskReward', convo)
  },
  taskIsTimed (convo: TWithFields): IResultEntryBoolean {
    return getBooleanEntry('taskTimed', convo)
  },
  getCheckType (convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('CheckType', convo, {
      returnKey: 'checkType'
    })
  },
  getCondition (convo: TWithFields): IResultEntryString {
    return getStringEntry('Condition', convo, {
      returnKey: 'condition',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getInstruction (convo: TWithFields): IResultEntryString {
    return getStringEntry('Instruction', convo, {
      returnKey: 'instruction',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getDifficulty (convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('Difficulty', convo, {
      returnKey: 'difficulty'
    })
  },
  getPlacement (convo: TWithFields): IResultEntryString {
    return getStringEntry('Placement', convo, {
      returnKey: 'placement'
    })
  },
  getActor (convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('Actor', convo, {
      returnKey: 'actorId'
    })
  },
  getConversant (convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('Conversant', convo, {
      returnKey: 'conversantId'
    })
  },
  getAltOrbText (convo: TWithFields): IResultEntryString {
    return getStringEntry('AlternateOrbText', convo, {
      returnKey: 'altOrbText'
    })
  },
  getOnUse (convo: TWithFields): IResultEntryString {
    return getStringEntry('OnUse', convo, {
      returnKey: 'onUse'
    })
  },
  getDialogOverride (convo: TWithFields): IResultEntryString {
    return getStringEntry('OverrideDialogueCondition', convo, {
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
