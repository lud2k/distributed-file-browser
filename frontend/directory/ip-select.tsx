import { Select, MenuItem } from '@material-ui/core'
import { fade, makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

const useStyles = makeStyles((theme) => ({
  select: {
    width: '20ch',
    height: '35px',
    color: 'white',
    padding: '0 20px',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },
  root: {
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    color: 'white',
    right: '10px',
  },
}))

interface Props {
  ips: string[]
  value: string | null
  onChange: (value: string | null) => void
}

export const IpSelect: React.FunctionComponent<Props> = ({ ips, value, onChange }) => {
  const classes = useStyles()
  return (
    <Select
      className={classes.select}
      classes={{ root: classes.root, icon: classes.icon }}
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
    >
      <MenuItem value={null}>All Hosts</MenuItem>
      {ips.map((ip) => (
        <MenuItem value={ip}>{ip}</MenuItem>
      ))}
    </Select>
  )
}
