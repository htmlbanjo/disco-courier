import chalk from 'chalk'
import { outputMode } from './args'
import { getOptions, getState, setState } from './shared'
import { messageText } from './out'
/*
 * Progressbar and detail rendering
 */

const options = getOptions()

const addProgressStep = message => {
  setState('messages', [...getState('messages'), message])
}

// TODO: memoize sections of this (e.g. paging)
const updateProgress = (note: string = '...'): void => {
  const messages = getState('messages')
  const paging = getOptions().paging
  let messageHistory: string = ''

  messages.map((msg, m) => {
    messageHistory += `\n\n          ✓ ${msg}`
  })
  if (!options.debug) {
    console.clear()
  }
  console.log(
    `\n\n\n\n
    ${messageText.commandHeader(options.entityList, paging, outputMode, note)}`,
    chalk.green(messageHistory),
    `\n\n${messageText.commandFooter(note)}`
  )
}

export { addProgressStep, updateProgress }
