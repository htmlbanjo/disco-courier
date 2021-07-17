import { Field } from '../defs/import'
import { DialogueEntry, DialogueItem } from '../defs/import'
import { TmplDialogEntry, TmplDialogEntryField } from '../defs/templates'

import {
  titleIs,
  valueOf,
  getSearchString,
  booleanValueOf,
  techName,
  shortDescription,
  description
} from '../util/inspection.util'

const templatize = (entity,item) => {
  switch(entity) {
    case 'actors':
      return ActorTemplate(item)
    case 'locations':
      return LocationTemplate(item)
    case 'variables':
      return VariableTemplate(item)
    case 'items':
      return ItemTemplate(item)
    case 'conversations':
      return ConversationTemplate(item)
    default:
      return { item: item }
  }
}

// TODO: move isNPC to xref
const ActorTemplate = (item) => {
  return { 
    "id": item.id,
    "name": valueOf('Name', item),
    "isPlayer": booleanValueOf('IsPlayer', item),
    "isNPC": booleanValueOf('IsNPC', item),
    "gameID": valueOf('Articy ID', item),
    "description": shortDescription(item),
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
}

// TODO: normalize actors 389-416
const SkillTemplate = (item) => {
  return {
    "id": item.id,
    "gameID": valueOf('Articy ID', item),
    "name": valueOf('Name', item),
    "description": shortDescription(item),
  }
}

const LocationTemplate = (item) => {
  return {
    "id": item.id,
    "name": valueOf('Name', item),
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
}

const VariableTemplate = (item) => {
  const name = valueOf('Name', item)
  const initValue = item?.fields.find(a => a.title.toLowerCase() === 'initial value')
  return {
    "id": item.id,
    "name": name,
    "type": name.split('.')[0],
    "label": name.split('.')[1],
    "valueType": initValue.typeString.split('_')[1],
    "defaultValue": initValue.value,
    "description": description(item),
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
}

const ItemTemplate = (item) => {
  return {
    "id": item.id,
    "name": valueOf('Name', item),
    "techName": techName(item),
    "displayName": valueOf('displayname', item),
    "isItem": booleanValueOf('isitem', item),
    "isConsumable": booleanValueOf('issubstance', item),
    "isAutoEquipable": booleanValueOf('autoequip', item),
    "isCursed": booleanValueOf('cursed', item),
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
}

/*****
 * TODO
 */
const ConversationTemplate = (item, select: 'all' | number = 'all') => {
  const entries: DialogueEntry[] = (select === 'all') ? [...item.dialogueEntries] : [...item.dialogueEntries[select]]
  return {
    "id": item.id,
    "title": valueOf('title', item, true),
    "dialogs": getDialogEntries(entries),
    "createdAt": new Date(),
    "updatedAt": new Date()
  }
}

const getDialogEntryFields = (fields: Field[], index: number) => {
  return fields.reduce((result: TmplDialogEntryField[], field: Field ) => {
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
  }, [] as TmplDialogEntryField[])
}
const getDialogEntries = (entries: DialogueEntry[]) => {
  return entries.reduce((entries: TmplDialogEntry[], entry: DialogueEntry, index: number) => {
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
    return entries;
  },[] as TmplDialogEntry[])
}

export {
  templatize,
  ActorTemplate,
  LocationTemplate,
  VariableTemplate, 
  ItemTemplate,
  ConversationTemplate
}
