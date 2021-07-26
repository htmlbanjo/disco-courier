import { TWithFields, Field, DialogueEntry } from '../defs/import'
import {
  ITmplDialogEntry,
  ITmplDialogEntryField,
  TConversationEntry
} from '../defs/templates'
import {
  valueOf,
  booleanValueOf,
  description,
  tableDates
} from '../search/index.search'
import {
  conversations,
  getSubtaskCount,
  getSubtasks,
  isATask,
  hasASubtask,
  isADoor,
  isAnOrb,
  isAHub,
  jumpsToHub,
  isTerminalDialog
} from '../search/conversation.search'

function BaseTemplate (item: TWithFields, extended: any): TConversationEntry {
  return {
    id: item.id,
    name: valueOf('Title', item),
    description: description(item),
    ...tableDates(item),
    ...extended
  }
}
function ExtendedTemplate (item: TWithFields): TConversationEntry {
  return BaseTemplate(item, {
    isDoor: isADoor(item),
    ...conversations.taskActive(item),
    ...conversations.taskCompleted(item),
    ...conversations.taskCancelled(item),
    ...conversations.taskReward(item),
    ...conversations.taskIsTimed(item),
    subtasks: getSubtaskCount(item)
  })
}

function CourierExtendedTemplate (item: TWithFields) {
  return {
    isTask: isATask(item),
    isOrb: isAnOrb(item),
    hasSubtask: hasASubtask(item),
    isHub: isAHub(item)
  }
}

export const ConversationTemplate = (item: TWithFields): TConversationEntry => {
  return BaseTemplate(item, {
    ...ExtendedTemplate(item),
    ...CourierExtendedTemplate(item)
  })
}

export const TaskTemplate = (item: TWithFields) => {
  if (isATask(item)) {
    return BaseTemplate(item, {
      ...conversations.taskActive(item),
      ...conversations.taskCompleted(item),
      ...conversations.taskCancelled(item),
      ...conversations.taskReward(item),
      ...conversations.taskIsTimed(item),
      ...conversations.getCheckType(item),
      ...conversations.getCondition(item),
      ...conversations.getInstruction(item),
      ...conversations.getPlacement(item),
      ...conversations.getActor(item),
      ...conversations.getConversant(item),
      subtasks: getSubtaskCount(item)
    })
  }
}

export const SubtaskTemplate = (item: TWithFields) => {
  if (hasASubtask(item)) {
    return BaseTemplate(item, {
      ...item
    })
  }
}

export const OrbTemplate = (item: TWithFields): TConversationEntry => {
  if (isAnOrb(item)) {
    return BaseTemplate(item, {
      ...conversations.getCheckType(item),
      ...conversations.getCondition(item),
      ...conversations.getInstruction(item),
      ...conversations.getDifficulty(item),
      ...conversations.getPlacement(item),
      ...conversations.getActor(item),
      ...conversations.getConversant(item)
    })
  }
}

export const HubTemplate = (item: TWithFields): TConversationEntry => {
  if (isAHub(item)) {
    return BaseTemplate(item, {})
  }
}

export const getDialogEntryFields = (fields: Field[], index: number) => {
  return fields.reduce((result: ITmplDialogEntryField[], field: Field) => {
    /*
    result.push({
      id: index + 1,
      isDialog: (valueWhereTitle(field, 'dialogue text')),
      isTask: getSearchString('subtask', field),
      text: valueWhereTitle(field, 'title'),
      textFull: valueWhereTitle(field, 'dialogue text'),
      sequence: valueWhereTitle(field, 'sequence'),
      actor: valueWhereTitle(field, 'actor'),
      conversant: valueWhereTitle(field, 'conversant'),
      inputID: valueWhereTitle(field, 'inputid'),
      outputID: valueWhereTitle(field, 'outputid'),
    })
    */
    return result
  }, [] as ITmplDialogEntryField[])
}
export const getDialogEntries = (entries: DialogueEntry[]) => {
  return entries.reduce(
    (entries: ITmplDialogEntry[], entry: DialogueEntry, index: number) => {
      /*
    entries.push({
      "id": entry.id,
      "parent": parseInt(entry.conversationID),
      "isRoot": entry.isRoot,
      "isGroup": entry.isGroup,
      "branches": entry?.outgoingLinks?.length,
      "links": entry.outgoingLinks,
      "meta": getDialogEntryFields(entry.fields, index, select),
      "metaLength": entry.fields.length,
    })
    */
      return entries
    },
    [] as ITmplDialogEntry[]
  )
}
