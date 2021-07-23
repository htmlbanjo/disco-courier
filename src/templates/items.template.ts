import {
  tableDates,
  valueOf,
  shortDescription,
  description,
  booleanValueOf,
  items,
  isAThought,
  isAKey,
  isADrug,
  isAConsumable,
  isAGame,
  isABook
} from '../lib/inspection'

import { outputMode } from '../lib/args'

function BaseTemplate (item: any, extended: any) {
  return {
    id: item.id,
    name: valueOf('Name', item),
    displayName: valueOf('displayname', item),
    description: description(item),
    ...extended,
    ...tableDates(item)
  }
}

function ExtendedTemplate (item: any) {
  return BaseTemplate(item, {
    ...items.itemType(item),
    ...items.itemGroup(item),
    ...items.itemValue(item),
    ...items.isItem(item),
    ...items.conversation(item),

    //stackname: applies to clothes (shoes_snakeskin_left and shoes_snakeskin_right to shoes_snakeskin), keys (to key_ring), bullets, tare (stacks to yellow_plastic_bag)
    ...items.stackName(item),

    ...items.isCursed(item),

    ...items.mediumTextValue(item),
    ...items.multipleAllowed(item),
    ...items.isAutoEquipable(item),

    ...items.isThought(item),
    ...items.isSubstance(item),
    ...items.isConsumable(item),
    ...items.isItem(item),
    ...items.isCursed(item),

    ...items.equipOrb(item),

    ...items.thoughtType(item),
    ...items.bonus(item),
    ...items.fixtureBonus(item),
    ...items.fixtureDescription(item),
    ...items.requirement(item),
    ...items.timeLeft(item)
  })
}

export const ItemTemplate = item => {
  return BaseTemplate(item, {
    ...ExtendedTemplate(item)
  })
}

export const ThoughtTemplate = item => {
  if (isAThought(item)) {
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
}

export const KeyTemplate = item => {
  if (isAKey(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.stackName(item)
    })
  }
}

export const SubstanceTemplate = item => {
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

export const ConsumableTemplate = item => {
  if (isAConsumable(item)) {
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

export const GameTemplate = item => {
  if (isAGame(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.conversation(item),
      ...items.isItem(item)
    })
  }
}

export const BookTemplate = item => {
  if (isABook(item)) {
    return BaseTemplate(item, {
      ...items.itemType(item),
      ...items.itemGroup(item),
      ...items.conversation(item),
      ...items.isItem(item)
    })
  }
}

export const NextTemplate = item => {
  return ItemTemplate(item)
}
