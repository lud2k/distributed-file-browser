import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    overflow: 'hidden',
    height: 'calc(100vh - 65px) ',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}))

interface Props {
  path: string
  host: string
}

export const ImageViewer: React.FunctionComponent<Props> = ({ path, host }) => {
  const classes = useStyles()
  const encodedPath = encodeURIComponent(path)
  const encodedHost = encodeURIComponent(host)
  return (
    <div className={classes.root}>
      <img className={classes.image} src={`/download?path=${encodedPath}&host=${encodedHost}`} />
    </div>
  )
}
