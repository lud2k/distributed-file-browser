import { Typography, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { config } from '../config'

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))

export const Path: React.FunctionComponent<{ path: string }> = ({ path }) => {
  const parts = path.split('/')
  const eles = parts.map((part, index) => {
    if (index === parts.length - 1) {
      return <span> / {part}</span>
    } else {
      return (
        <>
          <span> / </span>
          <Link
            color="inherit"
            component={RouterLink}
            to={`/directory/${parts.slice(0, index + 1).join('/')}`}
          >
            {part}
          </Link>
        </>
      )
    }
  })
  return (
    <>
      <Link color="inherit" component={RouterLink} to="/">
        {config.rootDirName}
      </Link>
      {eles}
    </>
  )
}

interface Props {
  path: string
}

export const AppBarPath: React.FunctionComponent<Props> = ({ path }) => {
  const classes = useStyles()
  return (
    <Typography variant="h6" className={classes.title} noWrap>
      <Path path={path} />
    </Typography>
  )
}
