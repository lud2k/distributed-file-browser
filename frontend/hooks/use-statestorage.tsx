import { Dispatch, SetStateAction, useState } from 'react'

export const useStateStorage = <T,>(key: string, def: T): [T, Dispatch<SetStateAction<T>>] => {
  try {
    const item = localStorage.getItem(key)
    if (item) {
      def = JSON.parse(item)
    }
  } catch (e) {
    console.warn(`Failed to get local storage value for: ${key}`)
  }

  const [val, set] = useState<T>(def)
  return [
    val,
    (newVal) => {
      set(newVal)
      try {
        localStorage.setItem(key, JSON.stringify(newVal))
      } catch (e) {
        console.warn(`Failed to set local storage value for: ${key}`)
      }
    },
  ]
}
