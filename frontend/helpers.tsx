import { MergedNode } from '../backend/types'
import * as moment from 'moment'

export const bytesToSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'N/A'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

export const toDateOrAgo = (timestamp: number): string => {
  if (moment().diff(timestamp, 'hours') < 24) {
    return moment(timestamp).fromNow()
  } else {
    return moment(timestamp).format('lll')
  }
}

export const nameToType = (node: MergedNode): string => {
  if (node.type === 'directory') {
    return 'Folder'
  } else {
    return 'File'
  }
}

export const isImage = (path: string): boolean => {
  const types = ['.svg', '.png', '.jpeg', '.jpg', '.gif', '.heif']
  const lowerPath = path.toLowerCase()
  for (const type of types) {
    if (lowerPath.endsWith(type)) {
      return true
    }
  }
  return false
}

export const concatBuffers = (buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer => {
  if (!buffer1) {
    return buffer2
  } else if (!buffer2) {
    return buffer1
  }

  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  tmp.set(new Uint8Array(buffer1), 0)
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength)
  return tmp.buffer
}
