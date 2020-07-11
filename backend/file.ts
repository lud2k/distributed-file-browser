import * as Express from 'express'
import * as fsPath from 'path'
import * as request from 'request'
import * as config from './config'
import { fileStats, readBytes } from './helper/file'

interface RequestQuery {
  path: string
  host?: string
  from: string
  to: string
}

type ResponseBody =
  | Buffer
  | {
      error?: any
    }

type Request = Express.Request<null, null, null, RequestQuery>
type Response = Express.Response<ResponseBody>

export const file = async (req: Request, res: Response) => {
  try {
    if (!req.query.host) {
      const path = fsPath.join(config.directory, req.query.path)
      const stats = await fileStats(path)
      if (!stats) {
        res.status(404).json({ error: `Path not found: ${req.query.path}` })
        return
      }

      const from = Math.max(parseInt(req.query.from, 10), 0)
      const to = Math.min(parseInt(req.query.to, 10), stats.size)

      const buffer = await readBytes(path, from, to)
      res.header('File-From', from.toString())
      res.header('File-To', to.toString())
      res.header('File-Size', stats.size.toString())
      res.end(buffer)
    } else {
      const encodedPath = encodeURIComponent(req.query.path)
      request(
        `http://${req.query.host}/file?path=${encodedPath}&from=${req.query.from}&to=${req.query.to}`
      ).pipe(res)
    }
  } catch (e) {
    console.error('Error reading file', e)
    res.status(500).json({ error: 'Oops! Something went wrong: ' + e })
  }
}
