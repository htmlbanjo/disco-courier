import { TWithFields, IResultEntry } from '../defs/import'
import {
  tableDates,
  valueOf,
  description,
  isAnInventoryItem,
  isAnEvidence
} from '../search/index.search'
import { normalizedNames } from '../replace/conversations.replace'
import { items, itemType, isAStackable } from '../search/items.search'

function BaseTemplate(item: TWithFields, extended: TWithFields): IResultEntry {
  return {
    itemId: item.id,
    name: valueOf('Name', item),
    type: itemType(item),
    displayName: valueOf('displayname', item),
    description: description(item),
    ...extended,
    ...tableDates()
  }
}

function ExtendedTemplate(item: TWithFields): IResultEntry {
  return BaseTemplate(item, {
    ...items.itemType(item),
    ...items.itemGroup(item),
    ...items.itemValue(item),
    ...items.conversation(item),
    ...items.stackName(item),
    ...items.mediumTextValue(item),
    ...items.multipleAllowed(item),
    ...items.isAutoEquipable(item),
    ...items.equipOrb(item),
    ...items.thoughtType(item),
    ...items.bonus(item),
    ...items.fixtureBonus(item),
    ...items.fixtureDescription(item),
    ...items.requirement(item),
    ...items.timeLeft(item),
    ...CourierExtrasTemplate(item)
  })
}
function CourierExtrasTemplate(item: TWithFields): IResultEntry {
  return {
    isStackable: isAStackable(item),
    isEvidence: isAnEvidence(item),
    isInventoryItem: isAnInventoryItem(item)
  }
}

export const ItemTemplate = (item: TWithFields): IResultEntry => {
  return BaseTemplate(item, {
    ...ExtendedTemplate(item)
  })
}

export const ItemLookupTemplate = (item: TWithFields): IResultEntry => {
  return {
    itemId: item.id,
    name: valueOf('Name', item),
    displayName: valueOf('displayname', item),
    conversation: normalizedNames(valueOf('conversation', item)),
    equipOrb: valueOf('equipOrb', item),
    type: itemType(item)
  }
}
