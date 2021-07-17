import {
  TWithFields, 
  Field, 
  Item
} from '../defs/import'

const whereKeyMatches = (key: string, match: string, item: TWithFields, lowercase=false):Field => {
  return (!!lowercase)
    ? item?.fields?.find((a: Field):boolean => a[key].toLowerCase() === match)
    : item?.fields?.find((a: Field):boolean => a[key] === match)
}
const whereKeyContains = (key: string, search: string, item: TWithFields, lowercase=false):Field => {
  return (!!lowercase) 
    ? (item?.fields?.find((a: Field):Field => a[key].toLowerCase().includes(search)))
    : (item?.fields?.find((a: Field):Field => a[key].includes(search)))
}

/**** CONVENIENCE / TEMPLATE SUGAR ****/
const titleIs  = (title: string, item: TWithFields, lowercase=false):Field => {
  return whereKeyMatches('title', title, item, lowercase)
}

const titleContains = (titleSearch: string, item: TWithFields, lowercase=false):Field => {
  return whereKeyContains('title', titleSearch, item, lowercase)
}

const valueContains = (valueSearch: string, item: TWithFields, lowercase=false):Field => {
  return whereKeyContains('value', valueSearch, item, lowercase)
}

const valueOf = (key: string, item: any, lowercase=false):string => {
  return (!!lowercase) ? titleIs(key, item, lowercase)?.value.toLowerCase() : titleIs(key, item, lowercase)?.value
}

const getSearchString = (search: string, item: any, lowercase=false):string | number | boolean => {
  if(!!lowercase) {
    return (titleContains(search, item, lowercase)?.value.toLowerCase())
  } else {
    return (titleContains(search, item, lowercase).value)
  }
}

const isTask = (item: any) => {
  return getSearchString('subtask_title', item)
}

const booleanValueOf = (key: string, item: Item):boolean  => {
  return (valueOf(key, item, true) === 'true') ? true : false
}

const findInField = (data: Item[], key: string, value: string) => {
  return data.reduce((matches, item: Item) => {
    if(item?.fields?.find(d => (d.title.toLowerCase() === key && d.value.toLowerCase() === value))) {
      matches.push(item)
    }
    return matches
  },[] as Item[])
}

const getName = (item: Item) => {
  return valueOf('name', item)
}

const techName = (item: Item) => {
  return valueOf('technical name', item)
}

const shortDescription = (item: Item) => {
  return valueOf('short_description', item)
}

const description = (item: Item) => {
  return valueOf('description', item) || undefined
}


export  {
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
  findInField
}