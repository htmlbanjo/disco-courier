import {
  valueOf,
  booleanValueOf,
  shortDescription,
  description
} from '../lib/inspection'

// TODO: move isNPC to xref?
export const ActorTemplate = item => {
  return {
    id: item.id,
    name: valueOf('Name', item),
    isPlayer: booleanValueOf('IsPlayer', item),
    isNPC: booleanValueOf('IsNPC', item),
    gameID: valueOf('Articy ID', item),
    description: shortDescription(item),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// TODO: normalize actors 389-416
export const SkillTemplate = item => {
  if (item.id < 389 || item.id > 416) {
    return
  }
  return {
    id: item.id,
    gameID: valueOf('Articy Id', item),
    name: valueOf('Name', item),
    description: shortDescription(item)
  }
}

// TODO: normalize actors 416-end
export const AttributeTemplate = item => {
  if (item.id < 417) {
    return null
  }
  return {
    id: item.id,
    gameID: valueOf('Articy Id', item),
    name: valueOf('Name', item),
    description: shortDescription(item)
  }
}
