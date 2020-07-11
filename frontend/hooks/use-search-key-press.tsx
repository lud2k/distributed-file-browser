import { useEffect } from 'react'

export const useSearchKeyPress = (fn: () => void): void => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'f') {
        fn()
        e.stopPropagation()
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })
}
