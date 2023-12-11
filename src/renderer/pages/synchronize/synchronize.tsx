import { Alert, Button, Snackbar, Stack, Link as MuiLink } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDidMount } from 'rooks'
import PageAppBar from '../../components/page-app-bar'
import Page from '../../components/page'
import { useSettings } from '../settings/use-settings'

function Synchronize() {
  const { t } = useTranslation()
  const { checkConfig, configError } = useSettings()

  useDidMount(() => {
    void checkConfig(true)
  })

  const onClickRefreshCheckConfig = () => {
    void checkConfig(true)
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
      </Page>
    </>
  )
}

export default Synchronize
