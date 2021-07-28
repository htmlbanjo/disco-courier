import {
  TWithFields,
  Field,
  TItem,
  IResultEntry,
  TKeyOutputFunction,
  IKeyFunctionOption
} from '../defs/import.d'
import { outputMode } from '../lib/args'

// TODO: a search factory or state item or some other method
// to avoid passing item to every call.

const whereKeyIs = (
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

const whereKeysMatch = (
  key: string,
  search: RegExp,
  item: TWithFields
): Field[] => item?.fields?.filter((a: Field): Field[] => a[key].match(search))

const whereTitlesHaveValuesAndMatch = (
  search: RegExp,
  item: TWithFields
): Field[] =>
  item?.fields?.filter((a: Field) => a.title?.match(search) && !!a.value)

const tableDates = () =>
  outputMode === 'seed'
    ? {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    : undefined

/**** CONVENIENCE / TEMPLATE SUGAR ****/
const titleIs = (title: string, item: TWithFields, lowercase = false): Field =>
  whereKeyIs('title', title, item, lowercase)

const titleContains = (
  titleSearch: string,
  item: TWithFields,
  lowercase = false
): Field => whereKeyContains('title', titleSearch, item, lowercase)

const filterTitlesByPattern = (search: RegExp, item: TWithFields): Field[] =>
  whereKeysMatch('title', search, item)

const valueContains = (
  valueSearch: string,
  item: TWithFields,
  lowercase = false
): Field => whereKeyContains('value', valueSearch, item, lowercase)

const valueOf = (key: string, item: TWithFields, lowercase = false): string => {
  return !!lowercase
    ? titleIs(key, item, false)?.value.toLowerCase()
    : titleIs(key, item, false)?.value
}

const getSearchString = (
  search: string,
  item: TWithFields,
  lowercase = false
): string | number | boolean => {
  if (!!lowercase) {
    return titleContains(search, item, lowercase)?.value.toLowerCase()
  } else {
    return titleContains(search, item, lowercase).value
  }
}

const keyValueStartsWith = (
  key: string,
  search: string,
  item: TWithFields
): boolean => {
  const searchStr = new RegExp(`^${search}`)
  return !!valueOf(key, item)?.match(searchStr)
}
const keyValueEndsWith = (
  key: string,
  search: string,
  item: TWithFields
): boolean => {
  const searchStr = new RegExp(`${search}$`)
  return !!valueOf(key, item)?.match(searchStr)
}

const searchInKey = (search: string, key: string, item: TWithFields) => {
  const searchStr = new RegExp(search)
  return valueOf(key, item)?.match(searchStr)
}

const valueExistsInKey = (
  search: string,
  key: string,
  item: TWithFields
): boolean => {
  return !!searchInKey(search, key, item)
}

const booleanValueOf = (key: string, item: TWithFields): boolean => {
  return valueOf(key, item, true) === 'true' ? true : false
}

const findInField = (data: TWithFields[], key: string, value: string) => {
  return data.reduce((matches, item: TWithFields) => {
    if (
      item?.fields?.find(
        d => d.title.toLowerCase() === key && d.value.toLowerCase() === value
      )
    ) {
      matches.push(item)
    }
    return matches
  }, [] as TWithFields[])
}

/* returns value of title (key) as object from item
 * coerced to specified type,
 * with option to override keyname. */
const keyFunction = (
  key: string,
  type: string,
  item: TWithFields,
  { returnKey = null, returnValueFn = null }: IKeyFunctionOption = {}
): IResultEntry => {
  switch (type) {
    case 'string':
      return returnValueFn
        ? { [returnKey || key]: returnValueFn(valueOf(key, item)) }
        : { [returnKey || key]: valueOf(key, item) }
    case 'boolean':
      return returnValueFn
        ? { [returnKey || key]: returnValueFn(booleanValueOf(key, item)) }
        : { [returnKey || key]: booleanValueOf(key, item) }
    case 'number':
      const value = parseInt(valueOf(key, item))
      if (isNaN(value)) {
        return { [returnKey || key]: undefined }
      }
      return returnValueFn
        ? {
            [returnKey || key]: returnValueFn(parseInt(valueOf(key, item)))
          }
        : { [returnKey || key]: parseInt(valueOf(key, item)) }
  }
}

/* value mutations:
 * TKeyOutputFunction types that can be used with
 * KeyFunction's returnValueFn callback
 */

// returns e.g. Task.variable_name without "Variable[\""]" wrapper.
const cleanVariableName = <TKeyOutputFunction>(value: string): string => {
  return value
    ? value.match(/Variable\[\"(?<varname>\w+.\w+)\"\]/)?.groups.varname
    : undefined
}
// returns name only, strips Variable[] and TASK., village., yard. etc
const cleanVariableNameNoPrefix = <TKeyOutputFunction>(
  value: string
): string => {
  return value
    ? value.match(/Variable\[\"[A-Za-z]+.(?<varname>\w+)\"\]/)?.groups.varname
    : undefined
}

/** GENERAL */

const getName = (item: TWithFields): string => valueOf('name', item)

const techName = (item: TWithFields): string => valueOf('technical name', item)

const refId = (item: TWithFields): string => valueOf('Articy Id', item)

const shortDescription = (item: TWithFields): string =>
  valueOf('short_description', item)

const longDescription = (item: TWithFields): string =>
  valueOf('LongDescription', item)

const description = (item: TWithFields): string =>
  valueOf('description', item) || valueOf('Description', item) || undefined

const isAnInventoryItem = (item: TWithFields): boolean =>
  valueExistsInKey(`^INVENTORY \/`, 'conversation', item)

const isAnEvidence = (item: TWithFields): boolean =>
  valueExistsInKey(`\(Evidence\)`, 'displayname', item)

export {
  whereKeyIs,
  whereKeyContains,
  whereKeysMatch,
  tableDates,
  titleIs,
  titleContains,
  filterTitlesByPattern,
  whereTitlesHaveValuesAndMatch,
  keyValueStartsWith,
  keyValueEndsWith,
  valueExistsInKey,
  valueContains,
  booleanValueOf,
  getName,
  techName,
  shortDescription,
  longDescription,
  description,
  valueOf,
  getSearchString,
  findInField,
  refId,
  keyFunction,
  cleanVariableName,
  cleanVariableNameNoPrefix,
  isAnInventoryItem,
  isAnEvidence
}
