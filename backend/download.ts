import * as Express from 'express'
import * as request from 'request'
import * as config from './config'
import * as fsPath from 'path'
import { normalizePath } from './helper/query'

interface RequestQuery {
  path?: string
  host?: string
}

type ResponseBody =
  | Buffer
  | {
      error?: any
    }

type Request = Express.Request<null, null, null, RequestQuery>
type Response = Express.Response<ResponseBody>

export const download = async (req: Request, res: Response) => {
  try {
    const queryPath = normalizePath(req.query.path)
    if (!queryPath) {
      return res.status(404).json({ error: `Path not found: ${req.query.path}` })
    }

    const filename = fsPath.basename(queryPath)
    res.header('Content-Disposition', `attachment; filename="${filename}"`)
    if (!req.query.host) {
      res.sendFile(queryPath, { root: config.directory })
    } else {
      const encodedPath = encodeURIComponent(queryPath)
      request(`http://${req.query.host}/download?path=${encodedPath}`).pipe(res)
    }
  } catch (e) {
    console.error('Error downloading file', e)
    res.status(500).json({ error: 'Oops! Something went wrong: ' + e })
  }
}
