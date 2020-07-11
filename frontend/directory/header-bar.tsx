import { AppBar, Toolbar } from '@material-ui/core'
import * as React from 'react'
import { AppBarFilter } from '../app-bar/filter'
import { IpSelect } from './ip-select'
import { AppBarPath } from '../app-bar/path'

interface Props {
  ips: string[]
  path?: string
  filter?: string
  onFilterChange: (filter: string) => void
  host?: string
  onHostChange: (filter: string) => void
}

export const HeaderBar: React.FunctionComponent<Props> = ({
  ips,
  path,
  filter,
  onFilterChange,
  host,
  onHostChange,
}) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <AppBarPath path={path} />
        <IpSelect ips={ips} value={host} onChange={onHostChange} />
        <AppBarFilter value={filter} onChange={onFilterChange} />
      </Toolbar>
    </AppBar>
  )
}
