#!/usr/bin/env node
import { getOptions, getState, setState } from './lib/shared'
import { messageText } from './lib/out'
import { paging } from './lib/paging'
import { addProgressStep, updateProgress } from './lib/progress'
import {
  streamSource,
  sourceFileExists,
  isSupportedVersion,
  setCachedItems,
  setActorFilters,
  actorConversantArgsSanityCheck,
  seedFileName,
  mdFileName,
  writeStream,
  mark,
  read,
  seed
} from './lib/migration'
;(async () => {
  const options = getOptions()
  /*
   * Operates on single key (actors, locations, etc) through template and send result to callback
   */
  const parseEntity = (
    source: string,
    entity: string,
    action: (entity, id, data) => void
  ) => {
    let all = {}
    all[entity] = []
    const [entityParent, entitySubprocess] = entity.split('.')
    const pipe = streamSource(source, entity)
    // total in stream
    let totalRows = 0
    // total compiled from offset (--start) flag.
    let totalFromStart = 0

    pipe.on('data', data => {
      ++totalRows

      if (data) {
        if (totalRows >= options.paging[0]) {
          ++totalFromStart
        }

        if (options.merge === true) {
          // TODO - performance/memory: refactor to push directly to writeStream.
          all[entity].push(data)
        } else {
          // TODO - row-by-row support, e.g. a noSQL doc or json file per row.
          // action(entity, data.id, data)
        }
      }

      if (
        totalRows === getState('currentVersion')?.rowCounts[entityParent] ||
        totalFromStart === options.paging[1]
      ) {
        // don't wait for readStream end event
        pipe.destroy()
      }
    })
    pipe.on('close', data => {
      if (all[entity].length < 1) {
        if (
          (getState('actor') || getState('conversant')) &&
          getState('hasConversations')
        ) {
          console.log(messageText.noResultsActorAdvice())
        }
        console.log(messageText.noResults())
        process.exit(0)
      }
      // TODO: Performance - assess paging during compilation rather than on whole result.
      const prePaging = all[entity].length
      all[entity] = paging(all[entity], options) // directly mutating all to avoid a "Next" in mem.
      // If offset was past the total number of results, indicate this.
      if (all[entity].length < 1) {
        setState(
          'mixedOutput',
          `${getState('mixedOutput') || ''}
           ${messageText.pagingPastTotalResults(
             entity,
             prePaging,
             options.paging[0]
           )}`
        )
      }

      addProgressStep(`Stream processed: ${entity} (read ${totalRows} rows)`)
      updateProgress(messageText.generatingEntity(entity))
      if (options.merge === true) {
        action(entity, entity, all)
      }
    })
    pipe.on('end', data => {
      pipe.destroy()
      // console.log(messageText.streamEOL())
    })
  }
  /*
   * Reports entity complete, ends app if last entity reached.
   */
  const end = (
    entityCount: number,
    totalEntities: number = options.entityList.length
  ) => {
    updateProgress(messageText.completedEntityNote())
    const casualPerfTime = parseInt(
      ((Date.now() - getState('start')) / 1000).toFixed(2)
    )
    if (entityCount === totalEntities) {
      addProgressStep(messageText.applicationEOL())
      updateProgress(
        `${messageText.completedWithTime(casualPerfTime)}
         ${getState('mixedOutput') || ''}`
      )
      if (options.outputMode === 'read') {
        getState('output').map(result => result())
      }
      process.exit(0)
    }
  }

  /* TODO: more async/await, less c.b.h / triangle-of-death */
  const processEntities = (source: string) => {
    let fileStream
    let entityCount: number = 0
    options.entityList.map((entity, i) => {
      updateProgress(messageText.openingProcess(entity))
      parseEntity(source, entity, (entityname, entityId, entityData) => {
        // TODO: consider moving these into switch statement to improve on hooks.
        updateProgress(messageText.writingToFile())
        fileStream = writeStream(options.outputMode, entity, entity)

        // TODO: break each case into a hooks directory for pluggable output support.
        switch (options.outputMode) {
          case 'read':
            setState('output', [
              ...getState('output'),
              read(entityname, entityId, entityData)
            ])
            addProgressStep(messageText.readProgressStep(entityname))
            end(++entityCount)
            break

          case 'write':
            fileStream.write(JSON.stringify(entityData, null, 2), () => {
              // TODO - need callback from fileStream so we know we're *actually* done with the write portion
              addProgressStep(
                messageText.writeProgressStep(
                  entityname,
                  entityData[entityname].length
                )
              )
              end(++entityCount)
            })
            break

          case 'seed':
            fileStream.write(seed(entityname, entityData[entity]), () => {
              addProgressStep(
                messageText.seedProgressStep(
                  entityname,
                  entityData[entityname].length,
                  seedFileName(entityname)
                )
              )
              end(++entityCount)
            })
            break

          case 'mark':
            fileStream.write(mark(entityname, entityData[entity]), () => {
              addProgressStep(
                messageText.mdProgressStep(
                  entityname,
                  entityData[entityname].length,
                  mdFileName(entityname)
                )
              )
              end(++entityCount)
            })
            break

          /*
           * TODO (in order of priority)
           * case 'nosql'  - for now use json option and import
           * case 'csv' via https://www.npmjs.com/package/json2csv
           * case 'sheet' (direct spreadsheet output) reallllly low-priority
           */

          default:
            setState('output', [
              ...getState('output'),
              read(entityname, entityId, entityData)
            ])
            addProgressStep(messageText.readProgressStep(entityname))
            end(++entityCount)
            break
        }
      })
    })
  }

  // init
  updateProgress(messageText.checkingForSourceFile())
  if (!sourceFileExists(options.sourceJSON)) {
    console.log(messageText.noSourceFileFound(options.sourceJSON))
    process.exit(0)
  }
  addProgressStep(messageText.sourceFileFound(options.sourceJSON))
  updateProgress(messageText.checkingForSupportedVersion())
  // checks the version key in the JSON export to make sure it's something we can work with.
  isSupportedVersion(
    options.sourceJSON,
    options.supportedVersions,
    versionResult => {
      // TODO: addtl. versions support
      setState('currentVersion', versionResult)

      addProgressStep(
        messageText.foundSupportedVersion(getState('currentVersion').version)
      )
      updateProgress(messageText.openingSourceFile())

      setCachedItems() // caching
      setActorFilters() //filters
      actorConversantArgsSanityCheck() // convenience messaging ux

      processEntities(options.sourceJSON) // do-the-work
    }
  )
})()
