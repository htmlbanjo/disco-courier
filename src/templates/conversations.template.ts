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
  getPassiveChecks,
  getAllChecks,
  getOutgoingLinks
} from '../search/conversations.dialog.search'

function BaseTemplate (convo: TWithFields, extended: any): TConversationEntry {
  return {
    conversationId: convo.id,
    name: valueOf('Title', convo),
    description: description(convo),
    ...tableDates(),
    ...extended
  }
}
function ExtendedTemplate (convo: TWithFields): TConversationEntry {
  return BaseTemplate(convo, {
    ...conversations.taskActive(convo),
    ...conversations.taskCompleted(convo),
    ...conversations.taskCancelled(convo),
    ...conversations.taskReward(convo),
    ...conversations.taskIsTimed(convo),

    ...conversations.getCheckType(convo),
    ...conversations.getCondition(convo),
    ...conversations.getInstruction(convo),
    ...conversations.getPlacement(convo),
    ...conversations.getActor(convo),
    ...conversations.getConversant(convo),
    ...conversations.getAltOrbText(convo),
    ...conversations.getOnUse(convo),
    ...conversations.getDialogOverride(convo),
    subTasks: getSubtasks(convo, 'string')
  })
}

function CourierExtendedTemplate (convo: TWithFields) {
  return {
    numSubtasks: getSubtaskCount(convo),
    isTask: isATask(convo),
    isOrb: isAnOrb(convo),
    hasSubtask: hasASubtask(convo),
    isHub: isAHub(convo),
    isDoor: isADoor(convo),
    dialogLength: convo?.dialogueEntries?.length
  }
}

export const ConversationTemplate = (
  convo: TWithFields
): TConversationEntry => {
  return BaseTemplate(convo, {
    ...ExtendedTemplate(convo),
    ...CourierExtendedTemplate(convo)
  })
}

export const TaskTemplate = (convo: TWithFields) => {
  if (isATask(convo)) {
    return BaseTemplate(convo, {
      ...conversations.taskActive(convo),
      ...conversations.taskCompleted(convo),
      ...conversations.taskCancelled(convo),
      ...conversations.taskReward(convo),
      ...conversations.taskIsTimed(convo),
      ...conversations.getCheckType(convo),
      ...conversations.getCondition(convo),
      ...conversations.getInstruction(convo),
      ...conversations.getPlacement(convo),
      ...conversations.getActor(convo),
      ...conversations.getConversant(convo),
      subtasks: getSubtaskCount(convo)
    })
  }
}

export const SubtaskTemplate = (convo: TWithFields) => {
  if (hasASubtask(convo)) {
    return getSubtasks(convo, 'obj')
  }
}

export const DialogTemplate = (convo: TWithFields) => {
  if (convo?.dialogueEntries?.length > 0) {
    return BaseTemplate(convo, {
      ...getDialogEntries(convo)
    })
  }
}

export const OrbTemplate = (convo: TWithFields): TConversationEntry => {
  if (isAnOrb(convo)) {
    return BaseTemplate(convo, {
      ...conversations.getCheckType(convo),
      ...conversations.getCondition(convo),
      ...conversations.getInstruction(convo),
      ...conversations.getDifficulty(convo),
      ...conversations.getPlacement(convo),
      ...conversations.getActor(convo),
      ...conversations.getConversant(convo),

      ...conversations.getActor(convo),
      ...conversations.getConversant(convo),
      ...conversations.getAltOrbText(convo),
      ...conversations.getOnUse(convo),
      ...conversations.getDialogOverride(convo)
    })
  }
}

// Note: Joyce seems to be the only top-level hub there is.
export const HubTemplate = (convo: TWithFields): TConversationEntry => {
  if (isAHub(convo)) {
    return BaseTemplate(convo, {})
  }
}

export const CheckTemplate = (convo: TWithFields): TConversationEntry => {
  return getAllChecks(convo) || undefined
}

export const WhiteCheckTemplate = (convo: TWithFields) =>
  getWhiteChecks(convo) || undefined

export const RedAndWhiteCheckTemplate = (convo: TWithFields) =>
  getWhiteAndRedChecks(convo) || undefined

export const RedCheckTemplate = (convo: TWithFields) =>
  getRedChecks(convo) || undefined

export const PassiveCheckTemplate = (convo: TWithFields) =>
  getPassiveChecks(convo) || undefined

export const GraphLinksTemplate = (convo: TWithFields) =>
  getOutgoingLinks(convo)
