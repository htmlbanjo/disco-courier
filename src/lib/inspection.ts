import { TWithFields, Field, TItem } from '../defs/import'

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
    ? titleIs(key, item, lowercase)?.value.toLowerCase()
    : titleIs(key, item, lowercase)?.value
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

const getName = (item: TItem) => valueOf('name', item)

const techName = (item: TItem) => valueOf('technical name', item)

const shortDescription = (item: TItem) => valueOf('short_description', item)

const description = (item: TItem) => valueOf('description', item) || undefined

/**** ITEMS */
const isAKey = (item: any): boolean => titleValueStartsWith('key_', item)

const isADrug = (item: any): boolean =>
  titleValueStartsWith('drug_', item) || !!booleanValueOf('isSubstance', item)

/**** DIALOG */
const isTask = (item: any) => getSearchString('subtask_title', item)

export {
  whereKeyMatches,
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
  isAKey,
  isADrug,
  isTask
}
