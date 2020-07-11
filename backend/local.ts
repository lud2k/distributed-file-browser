import { promises as fs, Stats } from 'fs'
import * as fsPath from 'path'
import * as Express from 'express'
import * as config from './config'
import { Directory, File, Node } from './types'
import asyncPool from 'tiny-async-pool'
import { normalizePath } from './helper/query'
import { fileStats } from './helper/file'

interface RequestQuery {
  path?: string
}

interface ResponseBody {
  node?: Node
  error?: any
}

type Request = Express.Request<null, null, null, RequestQuery>
type Response = Express.Response<ResponseBody>

const createFile = (path: string, stats: Stats): File => {
  return {
    path: path.substr(config.directory.length + 1),
    name: fsPath.basename(path),
    type: 'file',
    modifiedAt: stats.mtimeMs,
    createdAt: stats.ctimeMs,
    size: stats.size,
    host: config.host,
  }
}

const createDirectory = (path: string, stats: Stats): Directory => {
  return {
    path: path.substr(config.directory.length + 1),
    name: fsPath.basename(path),
    type: 'directory',
    modifiedAt: stats.mtimeMs,
    createdAt: stats.ctimeMs,
    size: stats.size,
    host: config.host,
  }
}

const getDirectoryNodes = async (path: string): Promise<(File | Directory)[]> => {
  const items = await fs.readdir(path)
  const nodes = await asyncPool(
    config.fileStatPoolSize,
    items,
    async (itemName: string): Promise<Node | undefined> => {
      const itemPath = fsPath.join(path, itemName)
      const stat = await fs.stat(itemPath)
      if (stat.isDirectory()) {
        return createDirectory(itemPath, stat)
      } else if (stat.isFile()) {
        return createFile(itemPath, stat)
      }
    }
  )
  return nodes.filter((node) => node)
}

export const localNode = async (req: Request, res: Response) => {
  try {
    const queryPath = normalizePath(req.query.path)
    const finalPath = fsPath.join(config.directory, queryPath)
    const stats = await fileStats(finalPath)
    if (!stats) {
      res.status(404).json({ error: `Path not found: ${queryPath}` })
      return
    }

    if (stats.isFile()) {
      res.json({ node: createFile(finalPath, stats) })
    } else if (stats.isDirectory()) {
      const node = createDirectory(finalPath, stats)
      node.nodes = await getDirectoryNodes(finalPath)
      res.json({ node })
    } else {
      res.status(400).json({ error: `Unsupported path: ${queryPath}` })
    }
  } catch (e) {
    console.error('Error getting local node', e)
    res.status(500).json({ error: e })
  }
}
