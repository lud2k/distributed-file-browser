import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const cache: { [key: string]: any } = {}

export const useMemStorage = <T,>(key: string, def: T): [T, Dispatch<SetStateAction<T>>] => {
  const [val, set] = useState<T>(cache[key] || def)

  useEffect(() => {
    set(cache[key] || def)
  }, [key])

  return [
    val,
    (newVal) => {
      set(newVal)
      cache[key] = newVal
    },
  ]
}
