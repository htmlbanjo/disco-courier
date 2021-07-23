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

    pipe.on('data', data => {
      ++totalRows
      if (data) {
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
          // TODO - performance: push directly to file during stream,
          // add header/footer in parent method.
          all[entity].push(data)
        } else {
          // TODO - row-by-row support, e.g. a noSQL doc or json file per row.
          // action(entity, data.id, data)
        }
      }
      if (totalRows === getState('currentVersion')?.rowCounts[entityParent]) {
        // readStream end event taking too long
        // despite pick/once and the "on" event being complete.
        pipe.destroy()
      }
    })
    pipe.on('close', data => {
      if (all[entity].length < 1) {
        console.log(getMessageText().noReults())
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
      updateProgress(getMessageText().processingLoop(entity))
      parseEntity(source, entity, (entityname, entityId, entityData) => {
        updateProgress(getMessageText().writingToFile())
        fileStream = writeStream(options.outputMode, entity, entity)

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
      // TODO: addtl. versions
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
