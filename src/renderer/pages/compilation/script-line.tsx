/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { iconFromStatus } from '../../utils/scripts/from-status'
import { isRunningScript } from '../../utils/scripts/status'
import { ScriptStatus } from '../../enums/script-status.enum'
import { useCompilation } from '../../hooks/use-compilation'
import type { ScriptRenderer } from '../../types'

interface ScriptLineProps {
  script: ScriptRenderer
  onClickRemoveScript: (script: ScriptRenderer) => void
  onClickPlayCompilation: (script: ScriptRenderer) => void
}

function ScriptLine({
  script,
  onClickRemoveScript,
  onClickPlayCompilation,
}: ScriptLineProps) {
  const { logs } = useCompilation()

  const scriptLogs = logs.find(([s]) => s.id === script.id)?.[1] ?? ''

  const { t } = useTranslation()

  const onClickRemove = () => {
    onClickRemoveScript(script)
  }

  const onClickPlay = () => {
    onClickPlayCompilation(script)
  }

  function StatusIcon() {
    const icon = iconFromStatus(script)

    if (!icon) return null

    return <ListItemIcon>{icon}</ListItemIcon>
  }

  return (
    <>
      <ListItem
        component={Paper}
        secondaryAction={
          <IconButton
            aria-disabled={isRunningScript(script)}
            aria-label={t('common.remove')}
            color="error"
            disabled={isRunningScript(script)}
            onClick={onClickRemove}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        }
        variant="outlined"
      >
        <ListItemIcon>
          <IconButton
            disabled={isRunningScript(script)}
            edge="end"
            onClick={onClickPlay}
            size="small"
          >
            <PlayCircleIcon className="text-primary-400" />
          </IconButton>
        </ListItemIcon>
        <ListItemText aria-label={script.name} primary={script.name} />
        <StatusIcon />
      </ListItem>
      {(script.status === ScriptStatus.failed ||
        script.status === ScriptStatus.success) && (
        <Paper
          className="block w-full rounded-tr-none rounded-tl-none bg-gray-800 p-4 text-white dark:bg-black-800"
          component="code"
          elevation={0}
          id={`${script.id}-logs`}
          role="log"
        >
          {scriptLogs.split('\n').map((log, i) => {
            /* eslint-disable react/no-array-index-key */
            return (
              <span
                className="select-text break-words text-justify font-mono text-xs"
                key={i}
              >
                {log}
                <br />
              </span>
            )
            /* eslint-enable react/no-array-index-key */
          })}
        </Paper>
      )}
    </>
  )
}

export default ScriptLine
