import { useEffect, useState } from 'react'
import { concatBuffers } from '../helpers'
import { config } from '../config'

const SIZE = config.filePreviewSize

export const getFile = async (
  path: string,
  host: string,
  from: number,
  to: number
): Promise<{ buffer: ArrayBuffer; from: number; to: number; size: number }> => {
  try {
    const encodedPath = encodeURIComponent(path)
    const encodedHost = encodeURIComponent(host)
    const response = await fetch(
      `/file?path=${encodedPath}&host=${encodedHost}&from=${from}&to=${to}`
    )
    if (response.status === 200) {
      try {
        const blob = await response.blob()
        const buffer = await blob.arrayBuffer()
        const fileSize = parseInt(response.headers.get('File-Size'), 10)
        const adjustedTo = parseInt(response.headers.get('File-To'), 10)
        return { buffer, from, to: adjustedTo, size: fileSize }
      } catch (e) {
        console.error('Failed to decode file', e)
        throw new Error('DECODE_FAILED')
      }
    } else {
      console.error('Failed to get file', response)
      throw new Error('SERVER_ERROR')
    }
  } catch (e) {
    console.error('Failed to get file', e)
    throw new Error('SERVER_ERROR')
  }
}

export interface UseFileState {
  loading: boolean
  complete: boolean
  textTop?: ArrayBuffer
  textBottom?: ArrayBuffer
  top?: number
  bottom?: number
  size?: number
}

export interface UseFile extends UseFileState {
  loadMoreTop: () => void
  loadMoreBottom: () => void
}

export const useFileLoader = (path: string, host: string): UseFile => {
  const [data, setData] = useState<UseFileState>({ loading: true, complete: false })

  const loadMoreTop = async () => {
    const res = await getFile(path, host, data.top, Math.min(data.top + SIZE, data.bottom))
    const textTop = concatBuffers(data.textTop, res.buffer)
    const top = res.to
    setData({ ...data, textTop, top, complete: top === data.bottom })
  }
  const loadMoreBottom = async () => {
    const res = await getFile(path, host, Math.max(data.top, data.bottom - SIZE), data.bottom)
    const textBottom = concatBuffers(res.buffer, data.textBottom)
    const bottom = res.from
    setData({ ...data, textBottom, bottom, complete: bottom === data.top })
  }

  useEffect(() => {
    async function fetchData() {
      setData({ loading: true, complete: false })

      const topFile = await getFile(path, host, 0, SIZE)
      const reachedEnd = topFile.to === topFile.size
      const bottomFile = !reachedEnd
        ? await getFile(path, host, Math.max(topFile.to, topFile.size - SIZE), topFile.size)
        : null
      const textTop = topFile.buffer
      const textBottom = bottomFile?.buffer
      const top = topFile.to
      const bottom = bottomFile?.from || topFile.size
      const complete = top === bottom

      setData({
        loading: false,
        top,
        bottom,
        complete,
        textTop,
        textBottom,
        size: topFile.size,
      })
    }
    fetchData()
  }, [path])

  return { ...data, loadMoreTop, loadMoreBottom }
}
