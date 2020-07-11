import { useEffect, useState } from 'react'
import { Node } from '../../backend/types'

export interface UseNodes {
  nodes?: Node[]
  loading: boolean
  errors?: string[]
  error?: string
}

export const useNodes = (path: string): UseNodes => {
  const [data, setData] = useState<UseNodes>({ loading: true })

  useEffect(() => {
    async function fetchData() {
      setData({
        loading: true,
        errors: null,
        error: null,
      })

      try {
        const response = await fetch(`/cluster-nodes?path=${encodeURIComponent(path)}`)
        const json = await response.json()
        setTimeout(() => {
          setData({
            ...json,
            loading: false,
          })
        }, 100)
      } catch (e) {
        setData({
          error: e.message,
          loading: false,
        })
      }
    }
    fetchData()
  }, [path])

  return data
}
