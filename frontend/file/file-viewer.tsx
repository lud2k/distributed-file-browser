import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FancyScroll } from './fancy-scroll'
import { useFileLoader } from '../hooks/use-file-loader'
import { concatBuffers } from '../helpers'
import { Watch } from './watch'
import { Button } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    height: 'calc(100vh - 65px)',
    overflow: 'scroll',
  },
  lines: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    lineBreak: 'anywhere',
    padding: '10px 10px 0 10px',
  },
  truncated: {
    background: 'rgba(63, 81, 181, 0.33)',
    maxWidth: '500px',
    margin: '20px auto',
    padding: '5px 10px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  buttons: {
    textAlign: 'center',
    padding: '10px 0',
  },
  button: {
    margin: '0 10px',
  },
}))

interface Props {
  path: string
  host: string
}

export const FileViewer: React.FunctionComponent<Props> = ({ path, host }) => {
  const classes = useStyles()
  const textDecoder = new TextDecoder()
  const {
    loading,
    complete,
    textTop,
    textBottom,
    size,
    loadMoreTop,
    loadMoreBottom,
  } = useFileLoader(path, host)

  return (
    <div className={classes.root}>
      <FancyScroll>
        {complete ? (
          <div className={classes.lines}>
            {textDecoder.decode(concatBuffers(textTop, textBottom))}
          </div>
        ) : (
          <>
            {textTop && <div className={classes.lines}>{textDecoder.decode(textTop)}</div>}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className={classes.buttons}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={loadMoreTop}
                >
                  ⇣ Load More From Top ⇣
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={loadMoreBottom}
                >
                  ⇡ Load More From Bottom ⇡
                </Button>
              </div>
            )}
            {textBottom && <div className={classes.lines}>{textDecoder.decode(textBottom)}</div>}
          </>
        )}
        {size && <Watch path={path} host={host} bottom={size} />}
      </FancyScroll>
    </div>
  )
}
