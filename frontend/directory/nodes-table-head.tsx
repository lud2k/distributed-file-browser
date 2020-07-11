import * as React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

export type SortDirection = 'asc' | 'desc'

const headCells = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'type', label: 'Type', sortable: true },
  { id: 'host', label: 'Host', sortable: true },
  { id: 'size', label: 'Size', sortable: true },
  { id: 'createdAt', label: 'Created', sortable: true },
  { id: 'modifiedAt', label: 'Modified', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false },
]

interface FilesTableHeadProps {
  order: SortDirection
  orderBy: string
  onRequestSort: (property: string) => void
}

export const NodesTableHead: React.FunctionComponent<FilesTableHeadProps> = ({
  order,
  orderBy,
  onRequestSort,
}) => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={index > 0 ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onRequestSort(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}
