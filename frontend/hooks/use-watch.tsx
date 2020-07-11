import { useEffect, useState } from 'react'

export interface UseWatch {
  lines?: [number, string][]
  error?: any
}

export const useWatch = (path: string, host: string, from: number): UseWatch => {
  const [data, setData] = useState<UseWatch>({ lines: [] })

  useEffect(() => {
    let reader: ReadableStreamDefaultReader<any> = null

    async function fetchData() {
      const lines: [number, string][] = []
      try {
        let lineNb = 0
        const encodedPath = encodeURIComponent(path)
        const encodedHost = encodeURIComponent(host)
        const response = await fetch(`/watch?path=${encodedPath}&host=${encodedHost}&from=${from}`)
        const utf8Decoder = new TextDecoder('utf-8')
        reader = response.body.getReader()

        while (reader) {
          const { value, done } = await reader.read()
          const decodedValue = value ? utf8Decoder.decode(value) : ''
          const newLines = decodedValue.split('\n')
          newLines.forEach((line) => lines.push([lineNb++, line]))
          if (lines.length > 80) {
            lines.splice(0, lines.length - 80)
          }
          setData({ lines })

          if (done) {
            break
          }
        }
      } catch (e) {
        console.error('Failed to watch file', e)
        setData({
          error: e.message || e,
        })
      }
    }
    fetchData()

    return () => {
      if (reader) {
        reader.cancel()
        reader = null
      }
    }
  }, [path])

  return data
}
