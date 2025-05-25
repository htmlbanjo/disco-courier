import {
  TWithFields,
  IResultEntryString,
  IResultEntryNumber,
  IResultEntryBoolean
} from '../defs/import'
import {
  getStringEntry,
  getNumberEntry,
  getStringToNumberEntry,
  getBooleanEntry,
  valueOf,
  cleanVariableName
} from './index.search'
import { itemTypeFromConversationTitle } from './items.search'
import { skillNameFromId } from './actors.search'
import { normalizedNames } from '../replace/conversations.replace'

export const conversations = {
  taskActive(convo: TWithFields): IResultEntryString {
    return getStringEntry('display_condition_main', convo, {
      returnKey: 'taskActive',
      returnValueFn: cleanVariableName
    })
  },
  taskCompleted(convo: TWithFields): IResultEntryString {
    return getStringEntry('done_condition_main', convo, {
      returnKey: 'taskComplete',
      returnValueFn: cleanVariableName
    })
  },
  taskCancelled(convo: TWithFields): IResultEntryString {
    return getStringEntry('cancel_condition_main', convo, {
      returnKey: 'taskCanceled',
      returnValueFn: cleanVariableName
    })
  },
  taskReward(convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('task_reward', convo, {
      returnKey: 'taskReward'
    })
  },
  taskIsTimed(convo: TWithFields): IResultEntryBoolean {
    return getBooleanEntry('task_timed', convo, {
      returnKey: 'taskTimed'
    })
  },
  getCheckType(convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('CheckType', convo, {
      returnKey: 'checkType'
    })
  },
  getCondition(convo: TWithFields): IResultEntryString {
    return getStringEntry('Condition', convo, {
      returnKey: 'condition',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getInstruction(convo: TWithFields): IResultEntryString {
    return getStringEntry('Instruction', convo, {
      returnKey: 'instruction',
      returnValueFn: cleanVariablesInCondition
    })
  },
  getDifficulty(convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('Difficulty', convo, {
      returnKey: 'difficulty'
    })
  },
  getPlacement(convo: TWithFields): IResultEntryString {
    return getStringEntry('Placement', convo, {
      returnKey: 'placement'
    })
  },
  getActor(convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('Actor', convo, {
      returnKey: 'actorId'
    })
  },
  getActorNameFromId(convo: TWithFields) {
    return { actorName: skillNameFromId(this.getActor(convo).actorId) }
  },
  getConversant(convo: TWithFields): IResultEntryNumber {
    return getNumberEntry('Conversant', convo, {
      returnKey: 'conversantId'
    })
  },
  getConversantNameFromId(convo: TWithFields) {
    return {
      conversantName: skillNameFromId(this.getConversant(convo).conversantId)
    }
  },
  getAltOrbText(convo: TWithFields): IResultEntryString {
    return getStringEntry('AlternateOrbText', convo, {
      returnKey: 'altOrbText'
    })
  },
  getOnUse(convo: TWithFields): IResultEntryString {
    return getStringEntry('OnUse', convo, {
      returnKey: 'onUse'
    })
  },
  getDialogOverride(convo: TWithFields): IResultEntryString {
    return getStringEntry('OverrideDialogueCondition', convo, {
      returnKey: 'dialogOverrideCondition'
    })
  },
  getFloorNumber(convo: TWithFields): IResultEntryNumber {
    return getStringToNumberEntry('Title', convo, {
      returnKey: 'floorNumber',
      returnValueFn: <TKeyOutputFunction>(value: string): number => {
        console.log(value)        
        const retVal = value?.replace(
          /(ROOF)|F{1}(\d{1})|S{1}(\d{1})$/,
          (
            orig: string,
            roof: string,
            floor: string,
            stair: string
          ): string => {
            return roof ? '99' : floor ? floor : stair ? stair : '0'
          }
        )
        return isNaN(parseInt(retVal)) ? 0 : parseInt(retVal)
      }
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

export const jumpsToHub = (convo: TWithFields): string => {
  const currTitle = valueOf('Title', convo)
  return currTitle
    ? currTitle.match(/^(Jump to: )\[(?<dest>\w+\s?\w+)\]/)?.groups?.dest
    : undefined
}
export const isTerminalDialog = (convo: TWithFields): boolean => {
  return !!jumpsToHub(convo)
}

export function getSubtaskCount(convo: TWithFields): number {
  let subtaskCount = 0
  convo?.fields?.map(field => {
    if (field.title.includes('subtask_title') && field.value) {
      ++subtaskCount
    }
  })
  return subtaskCount
}

export const titleValueStartsWith = (
  search: string,
  convo: TWithFields
): boolean => {
  const searchStr = new RegExp(`^${search}`)
  return !!valueOf('Title', convo)?.match(searchStr)
}
export const titleValueEndsWith = (
  search: string,
  convo: TWithFields
): boolean => {
  const searchStr = new RegExp(`${search}$`)
  return !!valueOf('Title', convo)?.match(searchStr)
}

export const isATask = (convo: TWithFields): boolean =>
  !!valueOf('task_reward', convo)

export const hasASubtask = (convo: TWithFields): boolean =>
  !!valueOf('subtask_title_01', convo)

export const isADoor = (name: string): boolean =>
  !!(name?.match(/\bDOOR\b/) || name?.match(/\bFLAP\b/))

export const isAnOrb = (convo: TWithFields): boolean => !!valueOf('Title', convo)?.match(/\bORB\b/)

export const isAHub = (name: string): boolean => !!name?.match(/HUB/i)

export const isALifeline = (name: string): boolean =>
  !!name.match(/^LIFELINE \//)

export const isAnInitiation = (name: string): boolean =>
  !!name.match(/^INITIATION \//)

export const isAThought = (name: string): boolean => !!name.match(/^THOUGHT \//)

export const isABedEvent = (name: string): boolean =>
  !!(name?.match(/^DAYCHANGE \//) || name?.match(/\bWAKEUP\b/))

export const isADream = (name: string): boolean => !!name.match(/\bDREAM\b/)

export const isAnInventoryItem = (name: string): boolean =>
  !!name.match(/^INVENTORY \//)

export const isAKimSwitch = (name: string): boolean =>
  !!name.match(/^KIM SWITCH \//)

export const isQuestInitiation = (name: string): boolean =>
  !!name.match(/Quest Initiation/)

export const isCommunistQuest = (name: string): boolean =>
  !!(name.match(/Communist Quest/gi) || name.match(/CommunistQuest/gi))

export const isUltraliberalQuest = (name: string): boolean =>
  !!(name.match(/Ultraliberal Quest/gi) || name.match(/UltraliberalQuest/gi))

export const isMoralistQuest = (name: string): boolean =>
  !!(name.match(/Moralist Quest/gi) || name.match(/MoralistQuest/gi))

export const isFaschistQuest = (name: string): boolean =>
  !!(name.match(/Faschist Quest/gi) || name.match(/FaschistQuest/gi))

export const isABark = (name: string): boolean => !!name.match(/\bBARKS\b/i)

export const hasALocation = (convo: TWithFields): boolean => {
  const name = valueOf('Title', convo)
  return (
    !isAThought(name) &&
    !isAnInitiation(name) &&
    !isATask(convo) &&
    !isALifeline(name) &&
    !!name?.match(/\//g)
  )
}

export const isGameOver = (convo: TWithFields): boolean =>
  !!valueOf('Title', convo)?.match(/GAME OVER!/)

export const getConversationType = (convo: TWithFields): string => {
  const name: string = normalizedNames(valueOf('Title', convo))
  return isAnInventoryItem(name)
    ? 'INVENTORY'
    : isAThought(name)
    ? 'THOUGHT'
    : isAnInitiation(name)
    ? 'INITIATION'
    : isALifeline(name)
    ? 'LIFELINE'
    : isATask(convo)
    ? 'TASK'
    : isAKimSwitch(name)
    ? 'KIM_SWITCH'
    : isABedEvent(name)
    ? 'BED_EVENT'
    : isABark(name)
    ? 'BARK'
    : isAnOrb(name)
    ? 'ORB'
    : isGameOver(convo)
    ? 'END'
    : 'GENERAL'
}
export const getConversationSubType = (convo: TWithFields): string => {
  const name: string = normalizedNames(valueOf('Title', convo))
  const itemType = itemTypeFromConversationTitle(name)
  return isAHub(name)
    ? 'HUB'
    : isADoor(name)
    ? 'DOOR'
    : isADream(name)
    ? 'DREAM'
    : isQuestInitiation(name)
    ? 'QUEST'
    : !!(isAnOrb(name) && convo.dialogueEntries.length > 2)
    ? 'DIALOGUEORB'
    : !!(isAnOrb(name) && convo.dialogueEntries.length < 3)
    ? 'FLAVORORB'
    : isAThought(name)
    ? 'CABINET'
    : !!(isATask(convo) && hasASubtask(convo))
    ? 'HASSUBTASK'
    : !!(
        isATask(convo) &&
        !hasASubtask(convo) &&
        conversations.taskIsTimed(convo).taskTimed
      )
    ? 'TIMED'
    : !!itemType
    ? itemType
    : null
}

export const nameExtendedSplitColumns = (convo: TWithFields) => {
  const name = normalizedNames(valueOf('Title', convo))

  if (
    isAnInventoryItem(name) ||
    isAThought(name) ||
    isAnInitiation(name) ||
    isALifeline(name) ||
    isABedEvent(name) ||
    isAKimSwitch(name) ||
    isATask(convo) ||
    isGameOver(convo)
  ) {
    return {
      location: undefined,
      floor: undefined,
      doorDescription: undefined,
      barkDescription: undefined
    }
  }


  
  const [, second] = name?.split('/')
  const [orbLocation, orbDescription] = name?.split(' ORB /')
  const [location, floorDesignator] = orbLocation.split(' ')

  const [doorDescription, isDoor] = (second?.includes(' DOOR')) ? second?.split(' DOOR') : [undefined, undefined]
  const [barkDescription, isBark] = (second?.includes(' barks')) ? second?.split(' barks') : [undefined, undefined]
  const subject = isDoor ? doorDescription : isBark ? barkDescription : second

  const floor = floorDesignator === '/' ? 'main' : floorDesignator
  const floorNumber = !floor
    ? undefined
    : floor === 'INT'
    ? 0
    : floor === 'ROOF'
    ? 99
    : floor === 'DREAM'
    ? 101
    : floor === '/'
    ? 0
    : floor.replace(/F{1}(\d)|S{1}(\d)/, (match, one, two) => {
        return one ? one : two
      })
  return {
    location,
    floor,
    floorNumber,
    subject
  }
}

export const junkEntries: string[] = [
  'DELETE',
  'DELETE FOLDER',
  'DELETE THIS FOLDER',
  'UNFINISHED ORB',
  'STAGE DIRECTIONS TEST DIALOGUE',
  'END TITLES TEST FOR ROZZO'
]

export const isValidEntry = (convo: TWithFields): boolean => {
  const replace = junkEntries.join('|')
  const invalidSet = new RegExp(replace, 'gi')
  return !!!valueOf('Title', convo)?.match(invalidSet)
}

const normalizeName = (convoName: string): string => {
  return convoName.replace(/([\w]+)(\/)/, (pre, del) => `/ ${pre} ${del}`)
}

/*
const isTask = (convo: TWithFields) => getSearchString('subtask_title', convo)
*/
