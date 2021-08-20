import { Field, TWithFields, IResultEntry } from '../defs/import'
import { getOptions } from '../lib/shared'
import { titleIs, valueOf, booleanValueOf, refId } from './index.search'
import { applyActorFilters } from './filters.search'
import { conversations } from './conversations.search'

import {
  skillNameFromId,
  skillIdFromRefId,
  convertToInGameDifficulty
} from './actors.search'
import { tableDates } from '../search/index.search'
const options = getOptions()

function isAWhiteCheck(entry: TWithFields): boolean {
  return !!titleIs('DifficultyWhite', entry)
}
function isARedCheck(entry: TWithFields): boolean {
  return !!titleIs('DifficultyRed', entry)
}
/* function isAPassiveCheck (entry: TWithFields): boolean {
  return !!valueOf('Title', entry).match(/Variable\[\"([A-Za-z]+.\w+)\"\]/)
} */
function isAPassiveCheck(entry: TWithFields): boolean {
  return !!titleIs('DifficultyPass', entry)
}
function isARedOrWhiteCheck(entry: TWithFields): boolean {
  return isAWhiteCheck(entry) || isARedCheck(entry)
}
function isACheck(entry: TWithFields): boolean {
  return isAWhiteCheck(entry) || isARedCheck(entry) || isAPassiveCheck(entry)
}

type TCheckType = 'red' | 'white' | 'passive' | 'all' | 'both'

//TODO: move templating-style fns into the proper template file.
function CheckTemplate(entry: TWithFields, type: TCheckType) {
  if (!!!applyActorFilters(entry)) {
    return undefined
  }
  /* TODO: performance: consider converting "is functions
   * to just return the field instead of boolean so the match
   * is readily available here.
   */
  const checkDetail =
    titleIs('DifficultyPass', entry) ||
    titleIs('DifficultyRed', entry) ||
    titleIs('DifficultyWhite', entry)

  const actorId: number = conversations.getActor(entry).actorId
  const conversantId: number = conversations.getConversant(entry).conversantId
  const skillRefId = valueOf('SkillType', entry)

  let modifiers: any = getCheckAspectList(entry)
  if (options.outputMode === 'mark' || options.outputMode === 'seed') {
    modifiers = JSON.stringify(modifiers)
  }

  return {
    dialogId: entry.id,
    conversationId: entry.conversationID,
    checkType: checkDetail.title.slice(10),
    checkDifficulty: parseInt(checkDetail.value),
    checkGameDifficulty: convertToInGameDifficulty(parseInt(checkDetail.value)),
    isRoot: entry.isRoot,
    isGroup: entry.isGroup,
    actorId,
    actorName: skillNameFromId(actorId),
    conversantId,
    conversantName: skillNameFromId(conversantId),
    shortDescription: valueOf('Title', entry),
    longDescription: valueOf('Dialogue Text', entry),
    refId: refId(entry),
    forced: booleanValueOf('Forced', entry),
    flag: valueOf('FlagName', entry),
    skillRefId,
    skillId: skillIdFromRefId(skillRefId),
    skillName: skillNameFromId(skillRefId),
    modifiers,
    inputId: valueOf('InputId', entry),
    outputId: valueOf('OutputId', entry),
    sequence: valueOf('Sequence', entry),
    conditionPriority: entry.conditionPriority,
    conditionString: entry.conditionString,
    userScript: entry.userScript.replace(/(\n)+/, ''),
    ...tableDates()
  }
}

function getCheckAspectList(entry: TWithFields) {
  const checks = []
  // if there's a skill check that has more than 21 modifiers, uh...it loses at blackjack?
  for (let i = 0; i < 20; i++) {
    const checkEntry = entry?.fields?.map((f: Field) => {
      const foundCheckDetail = f?.title?.match(
        new RegExp(`^(?<type>tooltip|variable|modifier)(?<pos>${i + 1})`)
      )?.groups.type
      if (!!foundCheckDetail && !!f?.value) {
        //checks[i] = checks[i] || {}
        checks[i] = { ...checks[i], [foundCheckDetail]: f?.value }
      }
    })
    if (checkEntry.length < 1) {
      i = 20
    }
  }
  return checks
}

/* TODO: Look, I get it. We could do a lot with variable function names.
 * Favoring explicit/SOLID over clever/DRY.
 */
function getTypeVerifier(type: TCheckType): (entry: TWithFields) => boolean {
  switch (type) {
    case 'both':
      return isARedOrWhiteCheck
    case 'passive':
      return isAPassiveCheck
    case 'white':
      return isAWhiteCheck
    case 'red':
      return isARedCheck
    case 'all':
      return isACheck
    default:
      throw new Error(`Couln't find a function to handle type ${type}`)
  }
}

function getChecksByType(type: TCheckType, convo: TWithFields) {
  const verifier = getTypeVerifier(type)
  if (convo?.dialogueEntries?.length < 1) {
    return undefined
  }
  // TODO: refactor this to return bool so CheckTemplate can be moved into conversation.templates.
  const results = convo?.dialogueEntries?.reduce((cChecks, entry) => {
    if (verifier(entry)) {
      cChecks.push(CheckTemplate(entry, type))
    }
    return cChecks
  }, [])
  return results?.length > 0 ? results : undefined
}

function getWhiteChecks(entry: TWithFields) {
  return getChecksByType('white', entry)
}

function getRedChecks(entry: TWithFields) {
  return getChecksByType('red', entry)
}

function getWhiteAndRedChecks(entry: TWithFields) {
  return getChecksByType('both', entry)
}

function getAllChecks(entry: TWithFields) {
  return getChecksByType('all', entry)
}

function getPassiveChecks(entry: TWithFields) {
  return getChecksByType('passive', entry)
}

//TODO: complete outgoinglinks xref
function getOutgoingLinks(convo: TWithFields) {
  return convo?.dialogueEntries?.reduce((entries, entry) => {
    entry.outgoingLinks.map(row => {
      entries.push({
        originConversationId: row.originConversationID,
        originDialogId: row.originDialogueID,
        destinationConversationId: row.destinationConversationID,
        destinationDialogId: row.destinationDialogueID,
        isConnector: row.isConnector,
        priority: row.priority,
        ...tableDates()
      })
    })
    return entries
  }, [])
}

export {
  getOutgoingLinks,
  getWhiteChecks,
  getRedChecks,
  getWhiteAndRedChecks,
  getPassiveChecks,
  getAllChecks,
  isAWhiteCheck,
  isARedCheck,
  isAPassiveCheck,
  isARedOrWhiteCheck,
  isACheck,
  getCheckAspectList
}
