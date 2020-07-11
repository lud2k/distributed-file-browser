import { useParams } from 'react-router-dom'
import * as React from 'react'
import { NodesTable } from './nodes-table'
import { HeaderBar } from './header-bar'
import { useNodes } from '../hooks/use-node'
import { Directory, Node } from '../../backend/types'
import { makeStyles } from '@material-ui/core/styles'
import { Loading } from '../common/loading'
import { useMemStorage } from '../hooks/use-memstorage'
import { Paper, Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'

const useStyles = makeStyles(() => ({
  message: {
    padding: '10px 20px',
  },
  errors: {
    padding: '10px 20px',
    backgroundColor: '#fde0dd',
  },
  errorIcon: {
    verticalAlign: 'text-bottom',
    marginRight: '10px',
  },
}))

const getContainedNode = (nodes: Node[]): Node[] => {
  // Only keep directories
  const directories = nodes.filter((node) => node.type === 'directory')
  // Extract nodes in those directories
  return [].concat(...directories.map((directory: Directory) => directory.nodes))
}

const filterNodes = (nodes: Node[], filter: string, host: string): Node[] => {
  if (filter) {
    nodes = nodes.filter((node) => node.name.toLowerCase().includes(filter))
  }
  if (host) {
    nodes = nodes.filter((node) => node.host === host)
  }
  return nodes
}

export const DirectoryPage: React.FunctionComponent = () => {
  const classes = useStyles()
  const { path } = useParams()
  const [filter, setFilter] = useMemStorage<string>(`dp-filter:${path}`, '')
  const [host, setHost] = useMemStorage<string>(`dp-host:${path}`, null)
  const { loading, nodes, error, errors } = useNodes(path)
  const containedNodes = getContainedNode(nodes || [])
  const filteredNodes = filterNodes(containedNodes, filter, host)

  return (
    <div>
      <HeaderBar
        path={path}
        filter={filter}
        onFilterChange={setFilter}
        host={host}
        onHostChange={setHost}
        ips={[...new Set(containedNodes.map((node) => node.host))]}
      />
      {loading && <Loading />}
      {errors?.length > 0 && (
        <Paper elevation={0} className={classes.errors}>
          <Typography color="error">
            <WarningIcon color="error" className={classes.errorIcon} />
            Some nodes failed to returned their files. Some files might be missing.
          </Typography>
          {errors.map((error, index) => (
            <Typography color="error">
              {index + 1}. {error}
            </Typography>
          ))}
        </Paper>
      )}
      {error && (
        <p className={classes.message}>Oops! Something went wrong. Try refreshing the page.</p>
      )}
      {!loading && !error && filteredNodes.length === 0 && !filter && (
        <p className={classes.message}>There are no files in this directory!</p>
      )}
      {!loading && !error && filteredNodes.length === 0 && filter && (
        <p className={classes.message}>No files in this directory matched the filter: {filter}</p>
      )}
      {!loading && !error && filteredNodes.length > 0 && (
        <NodesTable path={path} nodes={filteredNodes} />
      )}
    </div>
  )
}
