import { TWithFields } from 'defs/import'
import { TConversationEntry } from 'defs/templates'
import { getState, getOptions } from '../lib/shared'
import {
  valueOf,
  booleanValueOf,
  description,
  tableDates,
  titleIs,
  refId
} from '../search/index.search'
import { applyActorFilters } from '../search/filters.search'
import {
  conversations,
  isTerminalDialog,
  getSubtaskCount,
  isATask,
  hasASubtask,
  isADoor,
  isAnOrb,
  isAHub,
  isABedEvent,
  isADream,
  isAnInventoryItem,
  isAKimSwitch,
  isQuestInitiation,
  isCommunistQuest,
  isUltraliberalQuest,
  isMoralistQuest,
  isFaschistQuest,
  isABark,
  isALifeline,
  isAnInitiation,
  isAThought,
  hasALocation,
  jumpsToHub,
  nameExtendedSplitColumns,
  isValidEntry,
  getConversationType,
  getConversationSubType
} from '../search/conversations.search'
import { normalizedNames } from '../replace/conversations.replace'
import { getSubtasks } from '../search/conversations.subtask.search'
import {
  getWhiteChecks,
  getRedChecks,
  getWhiteAndRedChecks,
  getPassiveChecks,
  getAllChecks,
  getOutgoingLinks,
  isACheck,
  getCheckAspectList
} from '../search/conversations.dialog.search'

import {
  skillNameFromId,
  skillIdFromRefId,
  convertToInGameDifficulty
} from '../search/actors.search'

const options = getOptions()

function BaseTemplate(convo: TWithFields, extended: any): TConversationEntry {
  if (isValidEntry(convo)) {
    return {
      conversationId: convo.id,
      conversationType: getConversationType(convo),
      conversationSubType: getConversationSubType(convo),
      name: normalizedNames(valueOf('Title', convo)),
      description: description(convo),
      ...tableDates(),
      ...extended
    }
  }
}
function ExtendedTemplate(convo: TWithFields): TConversationEntry {
  if (isValidEntry(convo)) {
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
      ...conversations.getActorNameFromId(convo),
      ...conversations.getConversant(convo),
      ...conversations.getConversantNameFromId(convo),
      ...conversations.getAltOrbText(convo),
      ...conversations.getOnUse(convo),
      ...conversations.getDialogOverride(convo),
      subTasks: getSubtasks(convo, 'string')
    })
  }
}

function CourierExtendedTemplate(convo: TWithFields) {
  //...conversations.getFloorNumber(convo),
  // we shave about 4s on average from caching name here.
  const nameLookup = normalizedNames(valueOf('Title', convo))
  if (isValidEntry(convo)) {
    return {
      numSubtasks: getSubtaskCount(convo),
      hasSubtask: hasASubtask(convo),
      hasALocation: hasALocation(convo),
      dialogLength: convo?.dialogueEntries?.length,
      ...nameExtendedSplitColumns(convo)
    }
  }
}

export const ConversationTemplate = (
  convo: TWithFields
): TConversationEntry => {
  if (isValidEntry(convo) && applyActorFilters(convo)) {
    return BaseTemplate(convo, {
      ...ExtendedTemplate(convo),
      ...CourierExtendedTemplate(convo)
    })
  }
}

export const TaskTemplate = (convo: TWithFields) => {
  if (isATask(convo) && applyActorFilters(convo)) {
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
      subtasks: getSubtaskCount(convo)
    })
  }
}

export const SubtaskTemplate = (convo: TWithFields) => {
  if (hasASubtask(convo)) {
    return getSubtasks(convo, 'obj')
  }
}

export const OrbTemplate = (convo: TWithFields): TConversationEntry => {
  if (isAnOrb(convo) && applyActorFilters(convo)) {
    return BaseTemplate(convo, {
      ...conversations.getCheckType(convo),
      ...conversations.getCondition(convo),
      ...conversations.getInstruction(convo),
      ...conversations.getDifficulty(convo),
      ...conversations.getPlacement(convo),
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

export const DialogTemplate = (convo: TWithFields) => {
  /* TODO: offer a rollup version that preserves the graph,
   * for use with noSQL or de-normalized projects
   * Also, move template portions into conversations template.
   * Lastly, need a model/migration for Conversations without group.
   */

  const dialogRows = convo?.dialogueEntries?.reduce(
    (entries, entry: TWithFields) => {
      const isCheck = isACheck(entry)

      // CHECK
      const checkDetail =
        titleIs('DifficultyPass', entry) ||
        titleIs('DifficultyRed', entry) ||
        titleIs('DifficultyWhite', entry)

      const checkType = checkDetail?.title?.slice(10)
      const checkDifficulty = !!checkType
        ? parseInt(checkDetail?.value)
        : undefined
      const checkGameDifficulty = !!checkType
        ? convertToInGameDifficulty(parseInt(checkDetail?.value))
        : undefined

      const skillRefId = valueOf('SkillType', entry)

      let modifiers: any = getCheckAspectList(entry)
      if (options.outputMode === 'mark' || options.outputMode === 'seed') {
        modifiers = JSON.stringify(modifiers)
      }

      // END CHECK
      const actorId = conversations.getActor(entry).actorId
      const conversantId = conversations.getConversant(entry).conversantId

      if (applyActorFilters(entry)) {
        entries.push({
          parentId: convo.id,
          dialogId: entry.id,
          checkType,
          checkDifficulty,
          checkGameDifficulty,
          isRoot: entry.isRoot,
          isGroup: entry.isGroup,
          refId: refId(convo),
          isHub: isAHub(convo),
          dialogShort: valueOf('Title', entry),
          dialogLong: valueOf('Dialogue Text', entry),
          actorId,
          actorName: skillNameFromId(actorId),
          conversantId,
          conversantName: skillNameFromId(conversantId),
          skillRefId,
          skillId: skillIdFromRefId(skillRefId),
          skillName: skillNameFromId(skillRefId),
          modifiers,
          sequence: valueOf('Sequence', entry),
          conditionPriority: entry.conditionPriority,
          conditionString: entry.conditionString,
          userScript: entry.userScript,
          inputId: valueOf('InputId', entry),
          outputId: valueOf('OutputId', entry),
          flag: valueOf('FlagName', entry),
          ...tableDates()
        })
      }

      return entries
    },
    []
  )
  return dialogRows ? Object.values(dialogRows) : undefined
}

export const DialogTextTemplate = (convo: TWithFields) => {
  /* TODO: offer a rollup version that preserves the graph,
   * for use with noSQL or de-normalized projects
   * Also, move template portions into conversations template.
   * Lastly, need a model/migration for Conversations without group.
   */

  const dialogRows = convo?.dialogueEntries?.reduce(
    (entries, entry: TWithFields) => {
      const actorId = conversations.getActor(entry).actorId
      const conversantId = conversations.getConversant(entry).conversantId
      if (applyActorFilters(entry)) {
        entries.push({
          parentId: convo.id,
          dialogId: entry.id,
          dialogLong: valueOf('Dialogue Text', entry),
          actorName: skillNameFromId(actorId),
          conversantName: skillNameFromId(conversantId)
        })
      }
      return entries
    },
    []
  )
  return dialogRows ? Object.values(dialogRows) : undefined
}
