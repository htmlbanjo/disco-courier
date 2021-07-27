const skills = {
  389: 'Conceptualization',
  390: 'Logic',
  391: 'Encyclopedia',
  392: 'Rhetoric',
  393: 'Drama',
  394: 'Visual Calculus',
  395: 'Empathy',
  396: 'Inland Empire',
  397: 'Volition',
  398: 'Authority',
  399: 'Suggestion',
  400: 'Esprit de Corps',
  401: 'Endurance',
  402: 'Physical Instrument',
  403: 'Shivers',
  404: 'Pain Threshold',
  405: 'Electro-Chemistry',
  406: 'Half Light',
  407: 'Hand-Eye Coordination',
  408: 'Reaction Speed',
  409: 'Savoir Faire',
  410: 'Interfacing',
  411: 'Composure',
  412: 'Perception',
  413: 'Perception (smell)',
  414: 'Perception (hearing)',
  415: 'Perception (taste)',
  416: 'Perception (sight)'
}

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
export function skillNameFromId (id): string {
  return skills[id]
}

export function convertToInGameDifficulty (difficulty: number): number {
  return skillConversion[difficulty]
}
