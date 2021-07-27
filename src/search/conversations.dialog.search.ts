import { Field, TWithFields, IResultEntry } from '../defs/import'
import {
  titleIs,
  filterTitlesByPattern,
  whereTitlesHaveValuesAndMatch,
  valueOf,
  booleanValueOf,
  gameId,
  keyFunction
} from './index.search'
import { conversations, isAHub } from './conversations.search'

//TODO: move templating-style fns into the proper template file.

function getCheckAspectList (item: TWithFields) {
  const checks = []
  // if there's a check that has more than 21 modifiers, uh...it loses at blackjack?
  for (let i = 0; i < 20; i++) {
    const checkEntry = item?.fields?.map((f: Field) => {
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

function isAWhiteCheck (item: TWithFields) {
  return !!titleIs('DifficultyWhite', item)
}
function isARedCheck (item: TWithFields) {
  return !!titleIs('DifficultyRed', item)
}
const isAPassiveCheck = (item: TWithFields): boolean => {
  return !!valueOf('Title', item).match(/Variable\[\"([A-Za-z]+.\w+)\"\]/)
}

function isARedOrWhiteCheck (item: TWithFields) {
  return isAWhiteCheck(item) || isARedCheck(item)
}

function isACheck (item: TWithFields) {
  return isAWhiteCheck(item) || isARedCheck(item) || isAPassiveCheck(item)
}

function CheckTemplate (entry: TWithFields) {
  return {
    shortDescription: valueOf('Title', entry),
    longDescription: valueOf('Dialogue Text', entry),
    gameId: gameId(entry),
    difficulty: valueOf('DifficultyWhite', entry),
    forced: booleanValueOf('Forced', entry),
    flag: valueOf('FlagName', entry),
    skillGameId: valueOf('SkillType', entry),
    modifiers: getCheckAspectList(entry)
  }
}

//TODO: complete
function getPassiveChecks (item: TWithFields) {
  if (isAPassiveCheck(item)) {
    return CheckTemplate(item)
  }
}

function getChecksByColorType (
  color: 'red' | 'white' | 'both',
  item: TWithFields
) {
  if (!color) {
    throw new Error('no color for check specified.')
    process.exit(1)
  }
  const verifier =
    color === 'both'
      ? isARedOrWhiteCheck
      : color === 'red'
      ? isARedCheck
      : isAWhiteCheck
  if (item?.dialogueEntries?.length < 1) {
    return undefined
  }
  const results = item?.dialogueEntries?.reduce((cChecks, entry) => {
    if (verifier(entry)) {
      cChecks.push(CheckTemplate(entry))
    }
    return cChecks
  }, [])
  return results?.length > 0 ? results : undefined
}

function getWhiteChecks (item: TWithFields) {
  return getChecksByColorType('white', item)
}

function getRedChecks (item: TWithFields) {
  return getChecksByColorType('red', item)
}

function getWhiteAndRedChecks (item: TWithFields) {
  return getChecksByColorType('both', item)
}

/* TODO: offer a rollup version that preserves the graph,
 * for use with noSQL or de-normalized projects
 * Also, move template portions into conversations template.
 */
function getDialogEntries (item: TWithFields) {
  const dialogRows = item?.dialogueEntries?.reduce(
    (entries: IResultEntry[], entry: TWithFields) => {
      entries.push({
        parentId: item.id,
        internalId: entry.id,
        isRoot: entry.isRoot,
        isGroup: entry.isGroup,
        gameId: gameId(item),
        isHub: isAHub(item),
        dialogShort: valueOf('Title', entry),
        dialogLong: valueOf('Dialogue Text', entry),
        ...conversations.getActor(item),
        ...conversations.getConversant(item),
        sequence: valueOf('Sequence', entry),
        conditionPriority: entry.conditionPriority,
        conditionString: entry.conditionString,
        checkDifficulty: valueOf('DifficultyPass', entry),
        userScript: entry.userScript,
        inputId: valueOf('InputId', entry),
        outputId: valueOf('OutputId', entry)
      })

      return entries
    },
    [] as IResultEntry[]
  )
  return Object.values(dialogRows)
}

//TODO: complete outgoinglinks xref
function getOutgoingLinks (item: TWithFields) {
  item?.dialogueEntries?.reduce((entries, entry) => {
    entry.outgoingLinks.map(row => {
      entries.push({
        originConversationId: row.originConversationID,
        originDialogId: row.originDialogueID,
        destinationConversationId: row.destinationConversationID,
        destinationDialogId: row.destinationDialogID,
        isConnector: row.isConnector,
        priority: row.priority
      })
    })
  }, [])
}

export {
  getDialogEntries,
  getWhiteChecks,
  getRedChecks,
  getWhiteAndRedChecks,
  getPassiveChecks,
  isAWhiteCheck,
  isARedCheck,
  isAPassiveCheck,
  isARedOrWhiteCheck,
  isACheck
}
