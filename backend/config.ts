// Dev settings
export const isDev: boolean = process.env.DEV === 'true'

// General settings
export const discoveryMode: string = process.env.MODE
export const directory: string = process.env.DIRECTORY || '/var/log'
export const serverPort: number = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT, 10)
  : 3000
export const host: string = process.env.HOST.includes(':')
  ? process.env.HOST
  : `${process.env.HOST}:${serverPort}`

// Kubernetes settings (mode=kubernetes)
export const appName: string = process.env.APP_NAME || 'file-browser'
export const namespace: string = process.env.NAMESPACE || 'logging'

// Hardcoded hosts settings (mode=ips)
export const hosts: string = process.env.HOSTS

// Advanced options
export const fileStatPoolSize: number = process.env.FILE_STAT_POOL_SIZE
  ? parseInt(process.env.FILE_STAT_POOL_SIZE, 10)
  : 25

// Frontend config
export const title: string = process.env.TITLE || 'File Browser'
export const rootDirName: string = process.env.ROOT_DIR_NAME || 'root'
export const filePreviewSize: number = process.env.FILE_PREVIEW_SIZE
  ? parseInt(process.env.FILE_PREVIEW_SIZE, 10)
  : 100000
