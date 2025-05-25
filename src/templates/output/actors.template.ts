import { TWithFields } from '../../defs/import'
import {
  valueOf,
  booleanValueOf,
  numericValueOf,
  shortDescription,
  longDescription,
  tableDates,
  refId
} from '../../search/index.search'

function BaseTemplate (item: TWithFields, extended: any) {
  return {
    actorId: item.id,
    refId: refId(item),
    name: valueOf('Name', item),
    shortDescription: shortDescription(item),
    longDescription: longDescription(item),
    ...tableDates(),
    ...extended
  }
}
function ExtendedTemplate (item: TWithFields) {
  return BaseTemplate(item, {
    isPlayer: booleanValueOf('IsPlayer', item),
    isNPC: booleanValueOf('IsNPC', item),
    isFemale: booleanValueOf('IsFemale', item),
    PSY: numericValueOf('PSY', item),
    COR: numericValueOf('COR', item),
    ITL: numericValueOf('ITL', item),
    MOT: numericValueOf('MOT', item)
  })
}

export const ActorTemplate = (item: TWithFields) => {
  return BaseTemplate(item, {
    ...ExtendedTemplate(item)
  })
}

export const SkillTemplate = (item: TWithFields) => {
  if (item.id > 388 && item.id < 417) {
    return BaseTemplate(item, {})
  }
}

export const AttributeTemplate = (item: TWithFields) => {
  if (item.id > 416) {
    return BaseTemplate(item, {})
  }
}

export const LookupTemplate = (item: TWithFields) => {
  return {
    actorId: item.id,
    name: valueOf('Name', item),
    refId: refId(item)
  }
}
