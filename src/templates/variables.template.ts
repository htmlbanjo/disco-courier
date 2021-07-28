import { TWithFields } from '../defs/import'
import {
  valueOf,
  booleanValueOf,
  description,
  shortDescription,
  longDescription,
  tableDates
} from '../search/index.search'

function BaseTemplate (item: TWithFields, extended: any) {
  return {
    variableId: item.id,
    name: valueOf('Name', item),
    description: description(item),
    initialValue: booleanValueOf('Initial Value', item),
    ...tableDates(),
    ...extended
  }
}
function ExtendedTemplate (item: TWithFields) {
  return BaseTemplate(item, {})
}

function CourierExtendedTemplate (item: TWithFields) {
  const name = valueOf('Name', item)
  return {
    type: name.split('.')[0],
    label: name.split('.')[1]
  }
}

export const VariableTemplate = item => {
  return BaseTemplate(item, {
    ...ExtendedTemplate(item),
    ...CourierExtendedTemplate(item)
  })
}
