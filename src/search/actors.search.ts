import { getState } from '../lib/shared'

const skillConversion = {
  0: 6,
  1: 8,
  2: 10,
  3: 12,
  4: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 7,
  9: 9,
  10: 11,
  11: 13,
  12: 15,
  13: 17,
  14: 19
}

export function skillNameFromId(id: number | string): string {
  id = `${id}`
  id = isNaN(parseInt(id)) ? id : parseInt(id)
  const key: string = typeof id === 'string' ? 'refId' : 'actorId'
  return id === 387
    ? 'You'
    : getState('cache')?.actors.find(actor => actor[key] === id)?.name
}

export function IdFromActorName(name: number | string): string {
  return getState('cache')?.actors.find(actor => actor[name] === name)?.actorId
}

export function skillIdFromRefId(refId: string): number {
  return !!refId
    ? getState('cache')?.actors.find(actor => actor?.refId === refId).actorId
    : undefined
}

export function convertToInGameDifficulty(difficulty: number): number {
  return skillConversion[difficulty]
}
