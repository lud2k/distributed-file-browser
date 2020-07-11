import { LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

const useStyles = makeStyles(() => ({
  loading: {
    padding: '5px 10px',
  },
}))

export const Loading: React.FunctionComponent = () => {
  const classes = useStyles()
  return (
    <>
      <LinearProgress color="secondary" />
      <p className={classes.loading}>Loading…</p>
    </>
  )
}
