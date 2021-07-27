import { TWithFields, IResultEntry } from '../defs/import'
import { valueOf, gameId } from './index.search'
import { conversations } from './conversations.search'

/* TODO: offer a rollup version that preserves the graph,
 * for use with noSQL or de-normalized projects */
function getDialogEntries (item: TWithFields) {
  const dialogRows = item?.dialogueEntries?.reduce(
    (entries: IResultEntry[], entry: TWithFields) => {
      entries.push({
        parentId: item.id,
        internalId: entry.id,
        isRoot: entry.isRoot,
        isGroup: entry.isGroup,
        gameId: gameId(item),
        dialogShort: valueOf('Title', entry),
        dialogLong: valueOf('Dialogue Text', entry),
        ...conversations.getActor(item),
        ...conversations.getConversant(item),
        sequence: valueOf('Sequence', entry),
        conditionPriority: entry.conditionPriority,
        conditionString: entry.conditionString,
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

export { getDialogEntries }
