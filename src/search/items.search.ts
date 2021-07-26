import { TWithFields, IResultEntry } from '../defs/import'
import {
  keyFunction,
  valueOf,
  booleanValueOf,
  valueExistsInKey
} from './index.search'

const items = {
  itemType (item: TWithFields): IResultEntry {
    return keyFunction('itemType', 'number', item)
  },
  itemGroup (item: TWithFields): IResultEntry {
    return keyFunction('itemGroup', 'number', item)
  },
  itemValue (item: TWithFields): IResultEntry {
    return keyFunction('itemValue', 'number', item)
  },
  thoughtType (item: TWithFields): IResultEntry {
    return keyFunction('thoughtType', 'number', item)
  },
  timeLeft (item: TWithFields): IResultEntry {
    return keyFunction('timeLeft', 'number', item)
  },
  conversation (item: TWithFields): IResultEntry {
    return keyFunction('conversation', 'string', item)
  },
  stackName (item: TWithFields): IResultEntry {
    return keyFunction('stackName', 'string', item)
  },
  equipOrb (item: TWithFields): IResultEntry {
    return keyFunction('equipOrb', 'string', item)
  },
  mediumTextValue (item: TWithFields): IResultEntry {
    return keyFunction('MediumTextValue', 'string', item, {
      returnKey: 'mediumText'
    })
  },
  bonus (item: TWithFields): IResultEntry {
    return keyFunction('bonus', 'string', item)
  },
  fixtureBonus (item: TWithFields): IResultEntry {
    return keyFunction('fixtureBonus', 'string', item)
  },
  fixtureDescription (item: TWithFields): IResultEntry {
    return keyFunction('fixtureDescription', 'string', item)
  },
  requirement (item: TWithFields): IResultEntry {
    return keyFunction('requirement', 'string', item)
  },
  isItem (item: TWithFields): IResultEntry {
    return keyFunction('IsItem', 'boolean', item, { returnKey: 'isItem' })
  },
  isCursed (item: TWithFields): IResultEntry {
    return keyFunction('isCursed', 'boolean', item)
  },
  isThought (item: TWithFields): IResultEntry {
    return keyFunction('isThought', 'boolean', item)
  },
  isSubstance (item: TWithFields): IResultEntry {
    return keyFunction('isSubstance', 'boolean', item)
  },
  isConsumable (item: TWithFields): IResultEntry {
    return keyFunction('isConsumable', 'boolean', item)
  },
  isAutoEquipable (item: TWithFields): IResultEntry {
    return keyFunction('autoequip', 'boolean', item, {
      returnKey: 'isAutoEquipable'
    })
  },
  multipleAllowed (item: TWithFields): IResultEntry {
    return keyFunction('multipleAllowed', 'boolean', item)
  }
}

const nameValueStartsWith = (search: string, item: TWithFields): boolean => {
  const searchStr = new RegExp(`^${search}`)
  return !!valueOf('Name', item)?.match(searchStr)
}
const nameValueEndsWith = (search: string, item: TWithFields): boolean => {
  const searchStr = new RegExp(`${search}$`)
  return !!valueOf('Name', item)?.match(searchStr)
}

const isAKey = (item: TWithFields): boolean => nameValueStartsWith('key_', item)

const isAThought = (item: TWithFields): boolean =>
  booleanValueOf('isThought', item)

const isADrug = (item: TWithFields): boolean =>
  nameValueStartsWith('drug_', item) || booleanValueOf('isSubstance', item)

const isAConsumable = (item: TWithFields): boolean =>
  booleanValueOf('isConsumable', item)

const isABook = (item: TWithFields): boolean =>
  nameValueStartsWith('book_', item)

const isAGame = (item: TWithFields): boolean =>
  nameValueStartsWith('game_', item)

const isAnItem = (item: TWithFields): boolean => booleanValueOf('isItem', item)

const isATape = (item: TWithFields): boolean =>
  nameValueStartsWith('tape_', item)

const isAMusic = (item: TWithFields): boolean =>
  nameValueStartsWith('music_', item)

const isANote = (item: TWithFields): boolean =>
  nameValueStartsWith('note_', item)

const isAClothing = (item: TWithFields): boolean =>
  nameValueStartsWith('gloves_', item) ||
  nameValueStartsWith('shoes_', item) ||
  nameValueStartsWith('pants_', item) ||
  nameValueStartsWith('shirt_', item) ||
  nameValueStartsWith('jacket_', item) ||
  nameValueStartsWith('neck_', item)

const isAStackable = (item: TWithFields): boolean =>
  !!valueOf('stackName', item)

const isATare = (item: TWithFields): boolean =>
  nameValueEndsWith('_tare', item) ||
  valueExistsInKey(`^yellow_plastic_bag`, 'stackName', item)

const isADie = (item: TWithFields): boolean => nameValueEndsWith('_die', item)

export {
  items,
  nameValueStartsWith,
  nameValueEndsWith,
  isAThought,
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
}
