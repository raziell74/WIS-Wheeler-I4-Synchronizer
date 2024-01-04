/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { exec } from 'child_process'
import is from '@sindresorhus/is'
import { IpcEvent } from '../ipc-event'
import { Logger } from '../logger'
import { ApplicationException } from '../exceptions/application.exception'
import { fromError } from '../../common/from-error'
import type { Event } from '../interfaces/event'
import type { IpcMainEvent } from 'electron'

type TIconFrameMap = Map<string, number>

export class ScriptSwfDumpEvent implements Event {
  private logger = new Logger('ScriptSwfDumpEvent')

  async on(ipcEvent: IpcMainEvent, swf: string): Promise<void> {
    if (is.undefined(swf)) {
      throw new ApplicationException('script-swf-dump-on: swf is undefined')
    }

    this.logger.info('start swfDump', swf)
    this.logger.debug('checking the current store values')

    const endEvent = `${IpcEvent.swfDump}-test`

    const swfToolsPath = '.\\SWFTools'
    const cmd = `${swfToolsPath}\\swfdump.exe -t ${swf}`

    try {
      const iconFrameMap = await new Promise<TIconFrameMap>(
        (resolve, reject) => {
          exec(
            cmd,
            {
              cwd: '.\\',
              shell: 'powershell',
            },
            (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error.message}`)
                console.log('stderr:', stderr)
                reject(error.message)
                return
              }

              const regex =
                /\[02b\]\s+\d+\s+FRAMELABEL "(?<label>\w+)"\n*\s*\[002\]\s+\d+\s+DEFINESHAPE defines id (?<id>\d+)/g
              let match
              const mapper: TIconFrameMap = new Map()

              while ((match = regex.exec(stdout)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (match.index === regex.lastIndex) {
                  regex.lastIndex++
                }

                const { label, id } = match.groups ?? {}
                if (!label || !id) continue
                mapper.set(label, Number(id))
              }

              resolve(mapper)
            },
          )
        },
      )

      console.log(iconFrameMap)

      ipcEvent.reply(endEvent, {
        success: true,
        output: iconFrameMap,
        swf,
      })
    } catch (e) {
      const errorMessage: string = fromError(e).message

      ipcEvent.reply(endEvent, {
        success: false,
        output: errorMessage,
        swf,
      })
    }
  }
}
