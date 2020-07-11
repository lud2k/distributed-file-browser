import * as React from 'react'
import { useWatch } from '../hooks/use-watch'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { Button, LinearProgress } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  lines: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    lineBreak: 'anywhere',
    padding: '0 10px 10px 10px',
  },
  watching: {
    textAlign: 'center',
    padding: '38px 0 18px 0',
  },
  button: {
    textAlign: 'center',
    padding: '20px 0',
  },
  progress: {
    width: '100px',
    margin: '0 auto',
  },
}))

interface Props {
  path: string
  host: string
  bottom: number
}

export const Watch: React.FunctionComponent<Props> = ({ path, host, bottom }) => {
  const classes = useStyles()
  const [watch, setWatch] = useState(false)

  if (!watch) {
    return (
      <div className={classes.button}>
        <Button variant="contained" color="primary" size="small" onClick={() => setWatch(true)}>
          Watch File Changes
        </Button>
      </div>
    )
  }

  return <Watching path={path} host={host} bottom={bottom} />
}

export const Watching: React.FunctionComponent<Props> = ({ path, host, bottom }) => {
  const classes = useStyles()
  const { lines, error } = useWatch(path, host, bottom)
  return (
    <div>
      <div className={classes.lines}>
        {lines.map(([lineNb, lineText]) => (
          <div key={lineNb}>{lineText}</div>
        ))}
      </div>
      <div className={classes.watching}>
        <LinearProgress className={classes.progress} />
      </div>
      {error && 'Ooops! Something wrong happened while watching this file.'}
    </div>
  )
}
