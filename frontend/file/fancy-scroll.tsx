import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useEffect, useRef, useState } from 'react'

const useStyles = makeStyles(() => ({
  root: {
    height: 'calc(100vh - 65px)',
    overflow: 'scroll',
  },
  lines: {
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    lineBreak: 'anywhere',
    padding: '10px',
  },
}))

interface Props {
  onScrollReachTop?: () => void
  onScrollReachBottom?: () => void
}

export const FancyScroll: React.FunctionComponent<Props> = ({
  children,
  onScrollReachTop,
  onScrollReachBottom,
}) => {
  const classes = useStyles()
  const ref = useRef(null)
  const [stickToEnd, setStickToEnd] = useState(false)

  useEffect(() => {
    const ele = ref.current
    if (ele) {
      const onScroll = () => {
        if (ele) {
          const isEnd = ele.offsetHeight + ele.scrollTop >= ele.scrollHeight
          if (isEnd && onScrollReachBottom) {
            onScrollReachBottom()
          }
          if (ele.scrollTop === 0 && onScrollReachTop) {
            onScrollReachTop()
          }
          setStickToEnd(isEnd)
        }
      }
      const onDomChange = () => {
        const ele = ref.current
        if (ele && stickToEnd) {
          ele.scrollTop = ele.scrollHeight
        }
      }
      ele.addEventListener('DOMSubtreeModified', onDomChange)
      ele.addEventListener('scroll', onScroll)
      return () => {
        ele.removeEventListener('DOMSubtreeModified', onDomChange)
        ele.removeEventListener('scroll', onScroll)
      }
    }
  })

  return (
    <div ref={ref} className={classes.root}>
      {children}
    </div>
  )
}
