import { Dispatch, useState, SetStateAction } from 'react'
import { SortDirection } from '../directory/nodes-table-head'

type TableOrder = { by: string; dir: SortDirection; at?: number }

const STORE_NAME = 'table-order'
const DEFAULT_ORDER: TableOrder = { by: 'type', dir: 'asc' }
const MAX_STORE_SIZE = 50

let store: { [key: string]: TableOrder } = {}
try {
  store = JSON.parse(localStorage.getItem(STORE_NAME)) || {}
} catch (e) {
  // Either the store doesn't exist or it is invalid
}

const saveStore = () => {
  try {
    localStorage.setItem(STORE_NAME, JSON.stringify(store))
  } catch (e) {
    console.warn(`Failed to set table order local storage`)
  }
}

export const useTableOrder = (key: string): [TableOrder, Dispatch<TableOrder>] => {
  let storedValue
  if (store[key]) {
    storedValue = store[key]

    if (!storedValue.by || !storedValue.dir) {
      storedValue = { ...DEFAULT_ORDER }
    }

    if (storedValue.dir === DEFAULT_ORDER.dir && storedValue.by === DEFAULT_ORDER.by) {
      delete store[key]
    } else {
      storedValue.at = Date.now()
    }
    saveStore()
  } else {
    storedValue = { ...DEFAULT_ORDER }
  }

  const [value, setValue] = useState(storedValue)

  return [
    value,
    (newVal) => {
      newVal.at = Date.now()
      store[key] = newVal

      setValue(newVal)

      if (Object.keys(store).length > MAX_STORE_SIZE) {
        const orderedEntries = Object.entries(store).sort(
          ([_key1, val1], [_key2, val2]) => val1.at - val2.at
        )
        delete store[orderedEntries[0][0]]
      }

      saveStore()
    },
  ]
}
