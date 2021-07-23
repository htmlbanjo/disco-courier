import { TWithFields, Field, TItem } from '../defs/import'
import { outputMode } from './args'

const whereKeyMatches = (
  key: string,
  match: string,
  item: TWithFields,
  lowercase = false
): Field => {
  return !!lowercase
    ? item?.fields?.find((a: Field): boolean => a[key].toLowerCase() === match)
    : item?.fields?.find((a: Field): boolean => a[key] === match)
}
const whereKeyContains = (
  key: string,
  search: string,
  item: TWithFields,
  lowercase = false
): Field => {
  return !!lowercase
    ? item?.fields?.find(
        (a: Field): Field => a[key].toLowerCase().includes(search)
      )
    : item?.fields?.find((a: Field): Field => a[key].includes(search))
}

const tableDates = item => {
  if (outputMode === 'seed') {
    return {
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}

/**** CONVENIENCE / TEMPLATE SUGAR ****/
const titleIs = (
  title: string,
  item: TWithFields,
  lowercase = false
): Field => {
  return whereKeyMatches('title', title, item, lowercase)
}

const titleContains = (
  titleSearch: string,
  item: TWithFields,
  lowercase = false
): Field => {
  return whereKeyContains('title', titleSearch, item, lowercase)
}

const valueContains = (
  valueSearch: string,
  item: TWithFields,
  lowercase = false
): Field => {
  return whereKeyContains('value', valueSearch, item, lowercase)
}

const valueOf = (key: string, item: any, lowercase = false): string => {
  return !!lowercase
    ? titleIs(key, item, false)?.value.toLowerCase()
    : titleIs(key, item, false)?.value
}

const getSearchString = (
  search: string,
  item: any,
  lowercase = false
): string | number | boolean => {
  if (!!lowercase) {
    return titleContains(search, item, lowercase)?.value.toLowerCase()
  } else {
    return titleContains(search, item, lowercase).value
  }
}
const titleValueStartsWith = (search: string, item: any): boolean => {
  const searchStr = new RegExp(`^${search}`)
  return !!valueOf('Name', item).match(searchStr)
}
const booleanValueOf = (key: string, item: TItem): boolean => {
  return valueOf(key, item, true) === 'true' ? true : false
}

const findInField = (data: TItem[], key: string, value: string) => {
  return data.reduce((matches, item: TItem) => {
    if (
      item?.fields?.find(
        d => d.title.toLowerCase() === key && d.value.toLowerCase() === value
      )
    ) {
      matches.push(item)
    }
    return matches
  }, [] as TItem[])
}

const keyFunction = (
  key: string,
  type: string,
  item: any,
  keyname: string = undefined
) => {
  switch (type) {
    case 'string':
      return { [keyname || key]: valueOf(key, item) }
    case 'bool':
      return { [keyname || key]: booleanValueOf(key, item) }
    case 'number':
      return { [keyname || key]: parseInt(valueOf(key, item)) }
  }
}

/** GENERAL */
const getName = (item: TItem) => valueOf('name', item)

const techName = (item: TItem) => valueOf('technical name', item)

const shortDescription = (item: TItem) => valueOf('short_description', item)

const description = (item: TItem) => valueOf('description', item) || undefined

/**** ITEMS */

const items = {
  itemType (item) {
    return keyFunction('itemType', 'number', item)
  },
  itemGroup (item) {
    return keyFunction('itemGroup', 'number', item)
  },
  itemValue (item) {
    return keyFunction('itemValue', 'number', item)
  },
  conversation (item) {
    return keyFunction('conversation', 'string', item)
  },
  multipleAllowed (item) {
    return keyFunction('multipleAllowed', 'string', item)
  },
  stackName (item) {
    return keyFunction('stackName', 'string', item)
  },
  isItem (item) {
    return keyFunction('isItem', 'boolean', item)
  },
  isCursed (item) {
    return item => keyFunction('isCursed', 'boolean', item)
  },
  isThought (item) {
    return keyFunction('isThought', 'boolean', item)
  },
  isSubstance (item) {
    return keyFunction('isSubstance', 'boolean', item)
  },
  isConsumable (item) {
    return keyFunction('isConsumable', 'boolean', item)
  },
  equipOrb (item) {
    return keyFunction('equipOrb', 'string', item)
  },
  mediumTextValue (item) {
    return keyFunction('MediumTextValue', 'string', item, 'mediumText')
  },
  isAutoEquipable (item) {
    return keyFunction('autoequip', 'string', item, 'isAutoEquipable')
  },
  thoughtType (item) {
    return keyFunction('thoughtType', 'number', item)
  },
  bonus (item) {
    return keyFunction('bonus', 'string', item)
  },
  fixtureBonus (item) {
    return keyFunction('fixtureBonus', 'string', item)
  },
  fixtureDescription (item) {
    return keyFunction('fixtureDescription', 'string', item)
  },
  requirement (item) {
    return keyFunction('requirement', 'string', item)
  },
  timeLeft (item) {
    return keyFunction('timeLeft', 'number', item)
  }
}

const isAKey = (item: any): boolean => titleValueStartsWith('key_', item)

const isAThought = (item: any): boolean => booleanValueOf('isThought', item)

const isADrug = (item: any): boolean =>
  titleValueStartsWith('drug_', item) || booleanValueOf('isSubstance', item)

const isAConsumable = (item: any): boolean =>
  booleanValueOf('isConsumable', item)

const isABook = (item: any): boolean => titleValueStartsWith('book_', item)

const isAGame = (item: any): boolean => titleValueStartsWith('game_', item)

/**** DIALOG */
const isTask = (item: any) => getSearchString('subtask_title', item)

export {
  whereKeyMatches,
  whereKeyContains,
  tableDates,
  titleIs,
  titleContains,
  valueContains,
  booleanValueOf,
  getName,
  techName,
  shortDescription,
  description,
  valueOf,
  getSearchString,
  findInField,
  items,
  isAThought,
  isAKey,
  isADrug,
  isAConsumable,
  isABook,
  isAGame,
  isTask
}
