import * as React from 'react'
import { useState } from 'react'
import { sortBy, find } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TablePagination from '@material-ui/core/TablePagination'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { MergedNode, Node } from '../../backend/types'
import FolderIcon from '@material-ui/icons/Folder'
import DescriptionIcon from '@material-ui/icons/Description'
import { useHistory } from 'react-router'
import { bytesToSize, isImage, nameToType, toDateOrAgo } from '../helpers'
import { NodesTableHead, SortDirection } from './nodes-table-head'
import { IconButton } from '@material-ui/core'
import DownloadIcon from '@material-ui/icons/GetApp'
import ViewIcon from '@material-ui/icons/Visibility'
import OpenIcon from '@material-ui/icons/KeyboardArrowRight'
import { useTableOrder } from '../hooks/use-table-order'

const useStyles = makeStyles(() => ({
  paper: {
    width: '100%',
  },
  table: {
    width: '100%',
  },
  icon: {
    verticalAlign: 'bottom',
    opacity: 0.5,
  },
  row: {
    cursor: 'pointer',
    '&:hover button:last-child': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&:hover button:hover ~ button': {
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
  },
}))

const orderNodes = (nodes: MergedNode[], order: SortDirection, orderBy: string): MergedNode[] => {
  nodes = sortBy(nodes, [(o: any) => o[orderBy], 'name'])
  if (order === 'desc') {
    nodes = nodes.reverse()
  }
  return nodes
}

const nodeToMergedNode = (node: Node): MergedNode => {
  return {
    name: node.name,
    path: node.path,
    createdAt: node.createdAt,
    modifiedAt: node.modifiedAt,
    size: node.size,
    host: [node.host],
    type: node.type,
  }
}

const mergeNodes = (nodes: Node[]): MergedNode[] => {
  const ret = []
  for (const node of nodes) {
    if (node.type === 'file') {
      ret.push(nodeToMergedNode(node))
    } else if (node.type === 'directory') {
      const existing = find(ret, (n) => n.path === node.path)
      if (existing) {
        existing.host.push(node.host)
        existing.createdAt = Math.min(existing.createdAt, node.createdAt)
        existing.modifiedAt = Math.max(existing.modifiedAt, node.modifiedAt)
      } else {
        ret.push(nodeToMergedNode(node))
      }
    }
  }
  return ret
}

interface FilesTableProps {
  nodes: Node[]
  path: string
}

export const NodesTable: React.FunctionComponent<FilesTableProps> = ({ path, nodes }) => {
  const classes = useStyles()
  const history = useHistory()
  const [order, setOrder] = useTableOrder('ntOrderBy:' + path)
  const [page, setPage] = useState(0)
  const mergedNodes = mergeNodes(nodes)

  const open = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    if (e.metaKey) {
      window.open(history.createHref({ pathname: path }), '_blank')
    } else {
      history.push(path)
    }
  }

  const onClickRow = (e: React.MouseEvent, file: MergedNode) => {
    if (file.type === 'directory') {
      open(e, `/directory/${file.path}`)
    } else {
      onClickView(e, file)
    }
  }

  const onClickView = (e: React.MouseEvent, file: MergedNode) => {
    const encodedHost = encodeURIComponent(file.host[0])
    if (isImage(file.path)) {
      open(e, `/image/${file.path}?host=${encodedHost}`)
    } else {
      open(e, `/file/${file.path}?host=${encodedHost}`)
    }
  }

  const onClickDownload = (e: React.MouseEvent, file: MergedNode) => {
    e.stopPropagation()

    const encodedHost = encodeURIComponent(file.host[0])
    const encodedPath = encodeURIComponent(file.path)
    window.location.href = `/download?path=${encodedPath}&host=${encodedHost}`
  }

  const onRequestSort = (property: string) => {
    const newOrder = { ...order }
    if (order.by === property) {
      newOrder.dir = newOrder.dir === 'asc' ? 'desc' : 'asc'
    } else {
      newOrder.dir = 'asc'
      newOrder.by = property
    }
    setOrder(newOrder)
  }

  return (
    <>
      <TableContainer>
        <Table className={classes.table} size="small">
          <NodesTableHead order={order.dir} orderBy={order.by} onRequestSort={onRequestSort} />
          <TableBody>
            {orderNodes(mergedNodes, order.dir, order.by)
              .filter((_node, index) => index >= 100 * page && index < 100 * (page + 1))
              .map((node, index) => {
                return (
                  <TableRow
                    className={classes.row}
                    hover
                    onClick={(e) => onClickRow(e, node)}
                    key={node.path + node.type + node.host[0]}
                  >
                    <TableCell>
                      {node.type === 'directory' ? (
                        <FolderIcon fontSize="small" color="primary" className={classes.icon} />
                      ) : (
                        <DescriptionIcon
                          fontSize="small"
                          color="primary"
                          className={classes.icon}
                        />
                      )}{' '}
                      {node.name}
                    </TableCell>
                    <TableCell align="right">{nameToType(node)}</TableCell>
                    <TableCell align="right">
                      {node.host.length === 1 ? node.host : `${node.host.length} hosts`}
                    </TableCell>
                    <TableCell align="right">
                      {node.type === 'file' ? bytesToSize(node.size) : 'N/A'}
                    </TableCell>
                    <TableCell align="right">{toDateOrAgo(node.createdAt)}</TableCell>
                    <TableCell align="right">{toDateOrAgo(node.modifiedAt)}</TableCell>
                    <TableCell align="right">
                      {node.type === 'file' ? (
                        <>
                          <IconButton size="small" onClick={(e) => onClickDownload(e, node)}>
                            <DownloadIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => onClickView(e, node)}>
                            <ViewIcon fontSize="inherit" />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton size="small" onClick={(e) => onClickRow(e, node)}>
                          <OpenIcon fontSize="inherit" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[100]}
        count={mergedNodes.length}
        rowsPerPage={100}
        page={page}
        onChangePage={(_event, newPage) => setPage(newPage)}
      />
    </>
  )
}
