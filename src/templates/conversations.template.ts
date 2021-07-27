import { TWithFields } from '../defs/import'
import { TConversationEntry } from '../defs/templates'
import {
  valueOf,
  booleanValueOf,
  description,
  tableDates
} from '../search/index.search'
import {
  conversations,
  getSubtaskCount,
  isATask,
  hasASubtask,
  isADoor,
  isAnOrb,
  isAHub,
  jumpsToHub,
  isTerminalDialog
} from '../search/conversations.search'
import { getSubtasks } from '../search/conversations.subtask.search'
import {
  getDialogEntries,
  isAPassiveCheck,
  getWhiteChecks,
  getRedChecks,
  getWhiteAndRedChecks,
  getPassiveChecks
} from '../search/conversations.dialog.search'

function BaseTemplate (item: TWithFields, extended: any): TConversationEntry {
  return {
    internalID: item.id,
    name: valueOf('Title', item),
    description: description(item),
    ...tableDates(item),
    ...extended
  }
}
function ExtendedTemplate (item: TWithFields): TConversationEntry {
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
    ...conversations.getAltOrbText(item),
    ...conversations.getOnUse(item),
    ...conversations.getDialogOverride(item),
    subTasks: getSubtasks(item)
  })
}

function CourierExtendedTemplate (item: TWithFields) {
  return {
    numSubtasks: getSubtaskCount(item),
    isTask: isATask(item),
    isOrb: isAnOrb(item),
    hasSubtask: hasASubtask(item),
    isHub: isAHub(item),
    isDoor: isADoor(item),
    dialogLength: item?.dialogueEntries?.length
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
    return getSubtasks(item)
  }
}

export const DialogTemplate = (item: TWithFields) => {
  if (item?.dialogueEntries?.length > 0) {
    return BaseTemplate(item, {
      ...getDialogEntries(item)
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
      ...conversations.getConversant(item),

      ...conversations.getActor(item),
      ...conversations.getConversant(item),
      ...conversations.getAltOrbText(item),
      ...conversations.getOnUse(item),
      ...conversations.getDialogOverride(item)
    })
  }
}

// Note: Joyce seems to be the only top-level hub there is.
export const HubTemplate = (item: TWithFields): TConversationEntry => {
  if (isAHub(item)) {
    return BaseTemplate(item, {})
  }
}

export const CheckTemplate = (item: TWithFields): TConversationEntry => {
  if (item?.dialogueEntries?.length > 0) {
    return BaseTemplate(item, {
      red: getRedChecks(item),
      white: getWhiteChecks(item),
      passive: getPassiveChecks(item)
    })
  }
}

export const WhiteCheckTemplate = (item: TWithFields) =>
  getWhiteChecks(item) || undefined

export const RedAndWhiteCheckTemplate = (item: TWithFields) =>
  getWhiteAndRedChecks(item) || undefined

export const RedCheckTemplate = (item: TWithFields) =>
  getRedChecks(item) || undefined

export const PassiveCheckTemplate = (item: TWithFields) => {
  if (item?.dialogueEntries?.length > 0) {
    return BaseTemplate(item, {
      checks: getPassiveChecks(item)
    })
  }
}
