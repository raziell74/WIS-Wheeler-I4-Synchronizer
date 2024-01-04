import {
  Alert,
  Button,
  Snackbar,
  Stack,
  Link as MuiLink,
  Paper,
  Box,
} from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDidMount } from 'rooks'
import { is } from 'electron-util'
import PageAppBar from '../../components/page-app-bar'
import Page from '../../components/page'
import { useSettings } from '../settings/use-settings'
import { bridge } from '../../bridge'

function Synchronize() {
  const [output, setOutput] = useState('')
  const { t } = useTranslation()
  const { checkConfig, configError } = useSettings()

  useDidMount(() => {
    void checkConfig(true)
  })

  const onClickRefreshCheckConfig = () => {
    void checkConfig(true)
  }

  const swfToolsPath = '.\\SWFTools'
  const tempPath = '.\\temp'
  const swfPath = '".\\test_swf\\AIT\\Aura\\icons.swf"'

  const dumpSWF = () => {
    const cmd = `${swfToolsPath}\\swfdump.exe -t ${swfPath}`
    console.log('Running Command', cmd)
    bridge.swftools.dump(swfPath)

    // try {
    //   const dump =
    //   console.log('dump', dump)
    //   setOutput(dump.stdout)
    // } catch (err) {
    //   console.log('err', err)
    // }
  }

  return (
    <>
      <PageAppBar title={t('page.synchronize.title')} />
      <Page>
        <Snackbar open={Boolean(configError)}>
          <Alert
            action={
              <Stack alignItems="center" direction="row" gap={1}>
                <MuiLink component={Link} to="/settings">
                  {t('common.moreDetails')}
                </MuiLink>
                <Button onClick={onClickRefreshCheckConfig} size="small">
                  {t('common.refresh')}
                </Button>
              </Stack>
            }
            severity="error"
          >
            {t('config.checkError', { context: configError })}
          </Alert>
        </Snackbar>

        <Button>Get Load Order</Button>
        <Button>Get i4 config list and sort by Load Order</Button>
        <Button>Parse i4 Configs</Button>

        <hr />

        <Button onClick={() => dumpSWF()}>Generate Frame Map</Button>
        <Button>Extract Icon as PNG</Button>
        <Button>Convert PNG to SVG</Button>
        <Button>Colorize SVG</Button>

        <hr />

        <h2>Output</h2>
        <Box>
          <Paper elevation={3} sx={{ p: 1 }}>
            <pre>{output}</pre>
          </Paper>
        </Box>
      </Page>
    </>
  )
}

export default Synchronize
