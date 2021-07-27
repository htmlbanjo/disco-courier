import chalk from 'chalk'
import { getOptions } from './shared'

function activityIndicatorList () {
  return ['◉', '⧇', '⦾', '⦿', '✿']
}

function getMessageText () {
  /* errors */
  this.noResults = () =>
    chalk.red(`\n\n\n
             FAIL: Mister Dubois! Harry! Harry I really am sorry to tell you this big guy, I really am. 
             But my informants tell me there are No Entries Found for your search.\n\n
             It's just going to be impossible at this stage I'm afraid. Totally, utterly impossible. 
             I just can't see any way we're gonna find what you're looking for.
             But you're a nice guy Harry, I can tell. It really comes through. \n\n
             Maybe try running a few errands first? That always seems to help.\n\n\n`)

  this.noSourceFileFound = (sourcename: string) =>
    chalk.red(
      `Installation failed. Couldn't find "data/${sourcename}.json" file.`
    )

  this.versionUnsupported = (supportedVersions: string) =>
    chalk.red(
      `Sorry, the version of your data isn't supported. Supported versions: ${supportedVersions}`
    )

  this.failedToCreateDirectory = (dirName, err) =>
    chalk.red(
      `Error creating directory ./src/data/json/${dirName}. do you have the correct permissions? ${err}`
    )

  /* init checklist */
  this.checkingForSourceFile = () => 'Do you even json?'

  this.sourceFileFound = sourceFile =>
    `${sourceFile}.json file found. You did it! You showed up.`

  this.checkingForSupportedVersion = () =>
    'Peeking under the hood for a valid version of data...'

  this.foundSupportedVersion = (version: string) =>
    `Supported version found! (${version}) Well done detective.`

  this.openingSourceFile = () => 'Opening Source Json...'

  /* performing work */
  this.readProgressStep = (entity: string) =>
    `Applying template to ${entity}....Success!`

  this.writeProgressStep = (entity: string, dataLength: number) =>
    `Exporting ${entity} data (${dataLength} rows) to ${entity}.json )......Success!`

  this.seedProgressStep = (
    entity: string,
    dataLength: number,
    seedFile: string
  ) =>
    `Exporting ${entity} data (${dataLength} rows) to "${seedFile}".......Success!`

  this.openingProcess = (entity: string) => `* Opening ${entity}...`

  this.processingLoop = (entity: string) => `* Processing ${entity}...`

  this.writingToFile = () => `Exporting data...`

  this.generatingEntity = (entity: string) =>
    `Generating output for ${entity}...`

  /* wrapping up */
  this.completedWithTime = (totalTime: number) =>
    `✓ Setup Completed in ${totalTime} seconds. Sorry it wasn't sooner. (+1 Sorry app)`

  this.completedEntityNote = () => 'Entity Complete'

  /* Generic App */
  this.commandHeader = (
    entityList: string[],
    paging: [number, number?],
    outputMode: string,
    note: string
  ) =>
    `${chalk.bold(
      chalk.blueBright(
        `     :: ${chalk.magentaBright('DISCO-COURIER')}: tossing ${
          entityList.length > 1
            ? `${entityList.length} entities`
            : `${entityList[0]}`
        } into the Coupris${
          paging[0] !== 0
            ? ` (starting at: ${paging[0]}${
                !!paging[1]
                  ? `, heavy on the foot for ${paging[1]} entries.`
                  : ``
              })`
            : ``
        } Destination is "${outputMode}" mode for this SSSSOUPED UP MOTOR CARRIAGE. ::`
      )
    )}`

  this.commandFooter = (note: string) =>
    `          ${chalk.bold(chalk.greenBright(note))}`

  this.streamEOL = () =>
    chalk.red(
      `Hit end of stream without getting what we need. Check your query?`
    )
  this.applicationEOL = () => `Done!`

  return this
}

export { getMessageText, activityIndicatorList }
