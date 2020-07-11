import { useEffect, useState } from 'react'

export const getFile = async (
  path: string,
  host: string,
  from: number,
  to: number
): Promise<{ lines: string[]; from: number; to: number; size: number }> => {
  try {
    const encodedPath = encodeURIComponent(path)
    const encodedHost = encodeURIComponent(host)
    const response = await fetch(
      `/file?path=${encodedPath}&host=${encodedHost}&from=${from}&to=${to}`
    )
    if (response.status === 200) {
      try {
        const text = await response.text()
        const lines: string[] = text.split('\n')
        const fileSize = parseInt(response.headers.get('File-Size'), 10)
        const adjustedTo = parseInt(response.headers.get('File-To'), 10)
        return { lines, from, to: adjustedTo, size: fileSize }
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

export interface UseFile {
  lines?: [number, string][]
  hasMore?: boolean
  loading: boolean
  error?: 'SERVER_ERROR' | 'DECODE_FAILED'
}

export const useFile = (path: string, host: string, from: number, to: number): UseFile => {
  const [data, setData] = useState<UseFile>({ loading: true })

  useEffect(() => {
    async function fetchData() {
      setData({ loading: true, error: null, lines: null, hasMore: null })

      try {
        const encodedPath = encodeURIComponent(path)
        const encodedHost = encodeURIComponent(host)
        const response = await fetch(
          `/file?path=${encodedPath}&host=${encodedHost}&from=${from}&to=${to}`
        )
        if (response.status === 200) {
          try {
            const text = await response.text()
            const lines: [number, string][] = text.split('\n').map((line, index) => [index, line])
            const fileSize = parseInt(response.headers.get('File-Size'), 10)
            const adjustedTo = parseInt(response.headers.get('File-To'), 10)
            const hasMore = fileSize !== adjustedTo
            setData({ loading: false, lines, hasMore })
          } catch (e) {
            setData({ loading: false, error: 'DECODE_FAILED' })
          }
        } else {
          setData({ loading: false, error: 'SERVER_ERROR' })
        }
      } catch (e) {
        console.error('Failed to get file', e)
        setData({
          loading: false,
          error: 'SERVER_ERROR',
        })
      }
    }
    fetchData()
  }, [path])

  return data
}
