import chalk from 'chalk'

const activityIndicatorList = ['۞', '¤']
function siren (list: string[]): string {
  const fns = [chalk.redBright, chalk.blueBright]
  let pos = 0
  const s = list.reduce((out: string[], item: string) => {
    out.push(`${fns[pos](item)}`)
    pos = 1 - pos
    return out
  }, [])
  return s.join('')
}
//prettier-ignore
const header = ['','','','','','','','','','','','','','','','','','','','','๑','۞','๑',',','¸','¸',',','ø','¤','º','°','°','๑','۩','[',' ','D','I','S','C','O','-','C','O','U','R','I','E','R',' ',']','๑','۩',',','¸','¸',',','ø','¤','º','°','°','๑','۞','๑','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']
//prettier-ignore
const replacements = ['Ð','Ì','S','Ç','Õ','~','Ç','Ò','Ú','R','Î','Ë','R']
function shimmerTitle (count: number): string {
  let nextFn: Function
  let prevFn: Function = chalk.blue
  let repChar: number

  if (count < 36 || count >= 49) {
    nextFn = chalk.magenta
    prevFn = chalk.magentaBright
  }
  if (count >= 36 && count < 49) {
    prevFn = chalk.white
    nextFn = chalk.whiteBright
    repChar = count - 36
  }

  const nextHeader: string[] = [...header]

  const pReplacement: string =
    repChar - 1 > -1 ? replacements[repChar - 1] : nextHeader[count - 1]

  const replacement: string = repChar
    ? replacements[repChar]
    : nextHeader[count]

  nextHeader[count - 1] = prevFn(pReplacement)
  nextHeader[count] = nextFn(replacement)
  return nextHeader.join('')
}

function shimmerHR (count) {
  let nextcount = count < 0 ? 0 : count
  //prettier-ignore
  const hr = '-------~~------------------------~~---------------------~~----------✿'
  /*
  const nextHR = hr.split('')
  let rep = chalk.blueBright('~~')
  if (nextcount >= nextHR.length - 1) {
    rep = chalk.magentaBright('✿')
  }
  nextHR.splice(nextcount, 2, rep)
  return nextHR.join('')
  */
  return hr
}

function crashList () {
  //prettier-ignore
  return ['*','%','!','$','^','#','@','&','<','%','*','!','&','@','#','~','@','#','$','~','~','~','~','-','-','-','-','.','.','.','.']
}

const messageText = {
  count: -1,
  /********************** ERRORS ************************/
  noResults: function () {
    return chalk.red(`\n\n\n
             FAIL: Mister Dubois! Harry! Harry I really am sorry to tell you this big guy, I really am. 
             But my informants tell me there are No Entries Found for your search.\n\n
             It's just going to be impossible at this stage I'm afraid. Totally, utterly impossible. 
             I just can't see any way we're gonna find what you're looking for.
             But you're a nice guy Harry, I can tell. It really comes through. \n\n
             Maybe try running a few errands first? That always seems to help.\n\n\n`)
  },

  noResultsActorAdvice: function () {
    return chalk.red(`\n\n
             You feel as though you're searching for someone. Someone in your past. And yet you\n
             can't seem to find them. \n
             Sorry this didn't work out (+1 Sorry app).\n
             ${chalk.yellow(`Try searching conversations.dialog`)} specifically 
             if you're just looking for some quotes by a person,\n
             ${chalk.yellow(
               'try conversations.check'
             )} if you want checks filtered by a skill. \n`)
  },
  noConversationForActorOrConversant: function (flag: string) {
    return chalk.red(`\n
               ${this.courierCrashHeader()}\n
               The --${flag} argument only works on conversations and conversation groups. \n
               It won't work on non-conversation searches: you can't look for ${flag}s where there aren't any.
    ${chalk.dim(
      chalk.white(`     
                    Tips:     
                    * If you meant to search for a specific ${flag} in the actors list, use the --start and --results options instead.\n
                    * If you meant to search for a ${flag} in the list of items, locations or variables, there aren't any.`)
    )}
               \n
               Since there aren't any conversations specified, we can't do any more things. :(\n
               Move the butter sign and try again? There's always trying again.\n\n\n`)
  },
  noSourceFileFound: function (sourcename: string) {
    return chalk.red(
      `${this.courierCrashHeader()}\nInstallation failed. Couldn't find "data/${sourcename}.json" file.`
    )
  },
  versionUnsupported: function (supportedVersions: string) {
    return chalk.red(
      `${this.courierCrashHeader()}\nSorry, the version of your data isn't supported. Supported versions: ${supportedVersions}`
    )
  },
  failedToCreateDirectory: function (dirName, err) {
    return chalk.red(
      `${this.courierCrashHeader()}\nError creating directory ./src/data/json/${dirName}. do you have the correct permissions? ${err}`
    )
  },

  /********************** INIT CHECKLIST **********************/
  checkingForSourceFile: function () {
    return 'Do you even json?'
  },

  sourceFileFound: function (sourceFile) {
    return `${sourceFile}.json file found. You did it! You showed up.`
  },
  checkingForSupportedVersion: function () {
    return 'Peeking under the hood for a valid version of data...'
  },
  foundSupportedVersion: function (version: string) {
    return `Supported version found! (${version}) Well done detective.`
  },
  openingSourceFile: function () {
    return 'Opening Source Json...'
  },
  /******************** PERFORMING WORK *********************/

  readProgressStep: function (entity: string) {
    return `Applying template to ${entity}....Success!`
  },
  writeProgressStep: function (entity: string, dataLength: number) {
    return `Exporting ${entity} data (${dataLength} rows) to ${entity}.json )......Success!`
  },
  mdProgressStep: function (
    entity: string,
    dataLength: number,
    mdFile: string
  ) {
    return `Exporting ${entity} data (${dataLength} rows) to ${mdFile}.md )......Success!`
  },
  seedProgressStep: function (
    entity: string,
    dataLength: number,
    seedFile: string
  ) {
    return `Exporting ${entity} data (${dataLength} rows) to "${seedFile}".......Success!`
  },
  openingProcess: function (entity: string) {
    return `* Opening ${entity}...`
  },
  processingLoop: function (entity: string, count: number) {
    let actInd = `${activityIndicatorList[count]} `
    return `${actInd} Processing ${entity}...`
  },

  firstTimeSetup: function (count: number) {
    let actInd = `${activityIndicatorList[count]} `
    return `${actInd} Performing first-run setup tasks (caching actor list)...`
  },

  writingToFile: function () {
    return `  Exporting data...`
  },

  generatingEntity: function (entity: string) {
    return `  Generating output for ${entity}...`
    /* wrapping up */
  },
  completedWithTime: function (totalTime: number) {
    return `✓ Setup Completed in ${totalTime} seconds. Sorry it wasn't sooner. (+1 Sorry app)`
  },
  completedEntityNote: function () {
    return '٩( ᐛ )و  Entity Complete'
  },

  /*************************** WARNINGS ***********************/
  // --actor or --conversant used with both conversations and another entity.
  pagingPastTotalResults: function (
    entity: string,
    numResults: number,
    startPos: number
  ) {
    return `   ${chalk.cyan(`\n
            ${chalk.yellow('* Note:')} ${this.courierWarningTitle()}\n
                    Found ${numResults} entries for your search for ${entity}, but you asked to start at ${startPos}.\n
                    ${startPos} is more than ${numResults}! This is beyond the pale!\n
                    Nothing's gone wrong, This is just an explaination on why you are seeing an empty result.\n`)}`
  },
  mixedEntitiesWithActorOrConversant: function (flag: string) {
    return `   ${chalk.cyan(`\n
            ${chalk.yellow(
              '* Note:'
            )} You used the --${flag} option but chose to output more than just conversation items.\n
                    This is just a reminder that the ${flag}s filter will only apply to the conversation part of the output.\n
                    (the remaining entities and groups will run fine, but without the ${flag} filter)`)}\n\n`
  },
  conversantOnCheckItems: function () {
    return `   ${chalk.cyan(`
            ${chalk.yellow(
              '* Note:'
            )} filtering passive checks on conversant won't do much. (The conversant is always You).\n
                    Consider --actor=<skill#> instead?`)}`
  },
  /*************************** GENERAL USE ***********************/
  // TODO: move these out of getMessage() scope up to top-level function.
  commandHeader: function (
    entityList: string[],
    paging: [number, number?],
    outputMode: string,
    note: string
  ) {
    if (this.count === header.length - 1) {
      this.count = -1
    }
    ++this.count
    return `${chalk.bold(
      chalk.blueBright(
        `     ${shimmerTitle(this.count)}\n
         Tossing ${
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
        }\n
         Destination is "${outputMode}" mode for this SSSSOUPED UP MOTOR CARRIAGE.\n
         ${shimmerHR(this.count)}`
      )
    )}`
  },
  commandFooter: function (note: string) {
    return `          ${chalk.bold(chalk.greenBright(note))}`
  },
  //prettier-ignore
  courierCrashHeader:function () {
  return `${siren(crashList())}${chalk.yellowBright('  //Courier Crash!!\\\\  ')}${siren(crashList().reverse())}`
  },
  courierWarningTitle: function () {
    return `${chalk.grey(`This is....not great.  ┗|´Д｀*|┛\n`)}`
  },
  /************************* END-OF-LIFE *************************/

  streamEOL: function () {
    return chalk.red(
      `\n\n          [ ${chalk.yellow(
        `Hit end of stream without getting anything we wanted. Check your query?`
      )} ]`
    )
  },
  applicationEOL: function () {
    return `Done!`
  }
}

export { messageText, activityIndicatorList }
