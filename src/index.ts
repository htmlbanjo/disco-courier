#!/usr/bin/env node
import { getMessageText, activityIndicatorList } from './lib/out'
import { getOptions, getState, setState } from './lib/shared'
import { paging } from './lib/paging'
import {
  addProgressStep,
  updateProgress,
  advanceRowProgress
} from './lib/progress'
import {
  isSupportedVersion,
  streamSource,
  sourceFileExists,
  seedFileName,
  writeStream,
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
    const pipe = streamSource(source, entity, options.entityListDefaults)
    const activity = activityIndicatorList()
    let counter = 0
    let totalRows = 0
    let totalFromStart = 0

    pipe.on('data', data => {
      ++totalRows

      if (data) {
        if (totalRows >= options.paging[0]) {
          ++totalFromStart
        }
        // we return a falsey for data if the template returns null. This maintains totalRows count
        // against the entire array so we can run destroy() early for speed.
        advanceRowProgress(
          data,
          activity,
          counter,
          entity,
          totalRows,
          getState('messages')
        )
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
        console.log(getMessageText().noResults())
        process.exit(0)
      }
      // TODO: Performance - assess paging during compilation rather than on whole result.
      all[entity] = paging(all[entity], options)
      addProgressStep(`Stream processed: ${entity} (read ${totalRows} rows)`)
      updateProgress(getMessageText().generatingEntity(entity))
      if (options.merge === true) {
        action(entity, entity, all)
      }
    })
    pipe.on('end', data => {
      console.log(getMessageText().streamEOL())
    })
  }
  /*
   * Reports entity complete, ends app if last entity reached.
   */
  const end = (
    entityCount: number,
    totalEntities: number = options.entityList.length
  ) => {
    updateProgress(getMessageText().completedEntityNote())
    const casualPerfTime = ((Date.now() - getState('start')) / 1000).toFixed(2)
    if (entityCount === totalEntities) {
      addProgressStep(getMessageText().applicationEOL())
      updateProgress(getMessageText().completedWithTime(casualPerfTime))
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
      updateProgress(getMessageText().openingProcess(entity))
      parseEntity(source, entity, (entityname, entityId, entityData) => {
        // TODO: consider moving these into switch statement to improve on hooks.
        updateProgress(getMessageText().writingToFile())
        fileStream = writeStream(options.outputMode, entity, entity)

        // TODO: break each case into a hooks directory for pluggable output support.
        switch (options.outputMode) {
          case 'read':
            setState('output', [
              ...getState('output'),
              read(entityname, entityId, entityData)
            ])
            addProgressStep(getMessageText().readProgressStep(entityname))
            end(++entityCount)
            break

          case 'write':
            fileStream.write(JSON.stringify(entityData, null, 2), () => {
              // TODO - need callback from fileStream so we know we're *actually* done with the write portion
              addProgressStep(
                getMessageText().writeProgressStep(
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
                getMessageText().seedProgressStep(
                  entityname,
                  entityData[entityname].length,
                  seedFileName(entityname)
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
            addProgressStep(getMessageText().readProgressStep(entityname))
            end(++entityCount)
            break
        }
      })
    })
  }

  // init
  updateProgress(getMessageText().checkingForSourceFile())
  if (!sourceFileExists(options.sourceJSON)) {
    console.log(getMessageText().noSourceFileFound(options.sourceJSON))
    process.exit(0)
  }
  addProgressStep(getMessageText().sourceFileFound(options.sourceJSON))
  updateProgress(getMessageText().checkingForSupportedVersion())
  isSupportedVersion(
    options.sourceJSON,
    options.supportedVersions,
    versionResult => {
      // TODO: addtl. versions support
      setState('currentVersion', versionResult)
      addProgressStep(
        getMessageText().foundSupportedVersion(
          getState('currentVersion').version
        )
      )
      updateProgress(getMessageText().openingSourceFile())
      processEntities(options.sourceJSON)
    }
  )
})()
