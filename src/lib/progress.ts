import chalk from 'chalk'
import { outputMode } from './args'
import { getOptions, getState, setState } from '../shared'
/*
 * Progressbar and detail rendering
 */

const options = getOptions()

const addProgressStep = message => {
  setState('messages', [...getState('messages'), message])
}

const updateProgress = (note: string = '...'): void => {
  const messages = getState('messages')
  let numMessages: number = 4
  let prog: string = ''
  let messageHistory: string = ''
  let rest: string = ''
  let until = numMessages + options.entityList.length - messages.length
  for (let l = 1; l <= until; l++) {
    rest += '   '
  }
  messages.map((msg, m) => {
    prog += '==='
    messageHistory +=
      m + 1 === messages.length
        ? `\n\n          ✓ ${chalk.bold(chalk.greenBright(msg))}`
        : `\n\n          ✓ ${msg}`
  })
  if (!options.debug) {
    console.clear()
  }

  console.log(
    `\n\n\n   [${chalk.bgGreen(chalk.green(prog))}${rest}]\n\n\n
        ${chalk.bold(
          chalk.blueBright(
            `*~~~ DISCO-COURIER: tossing ${
              options.entityList.length > 1
                ? `${options.entityList.length} entities`
                : `${options.entityList[0]}`
            } into the Coupris and setting "${outputMode}" mode as the destination. ~~~*`
          )
        )}\n
        ${chalk.blue(note)}`,
    `${chalk.green(messageHistory)}`
  )
}

const advanceRowProgress = (
  data: any,
  activity: string[],
  counter: number,
  entity: string,
  totalRows: number,
  messages
): void => {
  if (options.debug) {
    return
  }
  if (data.id % 7 === 0) {
    let note = `${activity[counter < 4 ? (counter = counter++) : 0]} `
    note += `Migrating ${chalk.inverse(entity)} - row ${totalRows} `

    if (data?.fields) {
      note += data.fields[0]?.value ? `(${data?.fields[0]?.value})` : '...'
    }
    if (entity === 'conversations') {
      note +=
        '(BUCKLE UP, this step can take upwards of 10 or 15 minutes depending on your machine)'
    }
    updateProgress(note)
  }
}

export { addProgressStep, updateProgress, advanceRowProgress }
