import { Field } from '../defs/import'
import { DialogueEntry, DialogueItem } from '../defs/import'
import { ITmplDialogEntry, ITmplDialogEntryField } from '../defs/templates'
import { valueOf } from '../lib/inspection'

/*****
 * TODO
 */
export const ConversationTemplate = (item, select: 'all' | number = 'all') => {
  const entries: DialogueEntry[] =
    select === 'all'
      ? [...item.dialogueEntries]
      : [...item.dialogueEntries[select]]
  return {
    id: item.id,
    title: valueOf('title', item, true),
    dialogs: getDialogEntries(entries),
    createdAt: new Date(),
    updatedAt: new Date()
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
