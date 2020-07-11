export const normalizePath = (path: string): string => {
  if (!path) {
    return ''
  }
  return path.replace('../', '')
}
