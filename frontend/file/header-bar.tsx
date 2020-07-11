import { AppBar, Toolbar } from '@material-ui/core'
import * as React from 'react'
import { AppBarPath } from '../app-bar/path'
import { AppBarButton } from '../app-bar/button'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  path: string
  host: string
}

const useStyles = makeStyles(() => ({
  spinner: {
    marginRight: '10px',
  },
}))

export const HeaderBar: React.FunctionComponent<Props> = ({ host, path }) => {
  const classes = useStyles()

  const onClickDownload = () => {
    const encodedHost = encodeURIComponent(host)
    const encodedPath = encodeURIComponent(path)
    window.location.href = `/download?path=${encodedPath}&host=${encodedHost}`
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <AppBarPath path={path} />
        <AppBarButton onClick={onClickDownload}>Download</AppBarButton>
      </Toolbar>
    </AppBar>
  )
}
