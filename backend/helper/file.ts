import { promises as fs, Stats } from 'fs'

export const fileExists = async (path: string): Promise<boolean> => {
  return (await fileStats(path)) !== null
}

export const fileStats = async (path: string): Promise<Stats> => {
  try {
    return await fs.stat(path)
  } catch (e) {
    return null
  }
}

export const readBytes = async (path: string, from: number, to: number): Promise<Buffer> => {
  const file = await fs.open(path, 0)
  const length = to - from
  const buffer = Buffer.alloc(length)
  await file.read(buffer, 0, length, from)
  await file.close()
  return buffer
}
