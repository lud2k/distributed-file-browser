import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

const useStyles = makeStyles(() => ({
  button: {
    marginLeft: '20px',
    padding: '0 20px',
    height: '35px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  },
}))

export const AppBarButton: React.FunctionComponent<any> = (props) => {
  const classes = useStyles()
  return <Button className={classes.button} color="inherit" {...props} />
}
