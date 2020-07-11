import { useLocation, useParams } from 'react-router-dom'
import * as React from 'react'
import { HeaderBar } from './header-bar'
import * as QueryString from 'query-string'
import { FileViewer } from './file-viewer'

export const FilePage: React.FunctionComponent = () => {
  const { path } = useParams()
  const queryParams = QueryString.parse(useLocation().search)
  const host = queryParams.host as string
  return (
    <div>
      <HeaderBar host={host} path={path} />
      <FileViewer host={host} path={path} />
    </div>
  )
}
