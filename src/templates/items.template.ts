import { TWithFields, IResultEntry } from '../defs/import'
import {
  tableDates,
  valueOf,
  description,
  isAnInventoryItem,
  isAnEvidence
} from '../search/index.search'

import {
  items,
  isAKey,
  isADrug,
  isAConsumable,
  isAGame,
  isABook,
  isATape,
  isAMusic,
  isAClothing,
  isANote,
  isATare,
  isAStackable,
  isADie
} from '../search/items.search'

function BaseTemplate(item: TWithFields, extended: TWithFields): IResultEntry {
  return {
    itemId: item.id,
    name: valueOf('Name', item),
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
    ...items.isCursed(item),
    ...items.mediumTextValue(item),
    ...items.multipleAllowed(item),
    ...items.isAutoEquipable(item),
    ...items.isThought(item),
    ...items.isSubstance(item),
    ...items.isConsumable(item),
    ...items.isItem(item),
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
    isMusic: isAMusic(item),
    isTape: isATape(item),
    isEvidence: isAnEvidence(item),
    isInventoryItem: isAnInventoryItem(item),
    isClothing: isAClothing(item),
    isNote: isANote(item),
    isTare: isATare(item),
    isDice: isADie(item),
    isKey: isAKey(item)
  }
}

export const ItemTemplate = (item: TWithFields): IResultEntry => {
  return BaseTemplate(item, {
    ...ExtendedTemplate(item)
  })
}

export const ThoughtTemplate = (item: TWithFields): IResultEntry => {
  return BaseTemplate(item, {
    ...items.itemType(item),
    ...items.itemGroup(item),
    ...items.thoughtType(item),
    ...items.bonus(item),
    ...items.fixtureBonus(item),
    ...items.fixtureDescription(item),
    ...items.requirement(item),
    ...items.timeLeft(item)
  })
}

export const KeyTemplate = (item: TWithFields): IResultEntry => {
  if (isAKey(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.stackName(item)
    })
  }
}

export const SubstanceTemplate = (item: TWithFields): IResultEntry => {
  if (isADrug(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.itemValue(item),
      ...items.mediumTextValue(item),
      ...items.multipleAllowed(item),
      ...items.equipOrb(item)
    })
  }
}

export const ConsumableTemplate = (item: TWithFields): IResultEntry => {
  if (isAConsumable(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.itemValue(item),
      ...items.mediumTextValue(item),
      ...items.multipleAllowed(item)
    })
  }
}

export const GameTemplate = (item: TWithFields): IResultEntry => {
  if (isAGame(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.conversation(item)
    })
  }
}

export const BookTemplate = (item: TWithFields): IResultEntry => {
  if (isABook(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.conversation(item)
    })
  }
}

export const ClothingTemplate = (item: TWithFields): IResultEntry => {
  if (isAClothing(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.equipOrb(item)
    })
  }
}

export const TareTemplate = (item: TWithFields): IResultEntry => {
  if (isATare(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.conversation(item)
    })
  }
}
