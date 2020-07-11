import * as Express from 'express'
import * as fsPath from 'path'
import * as request from 'request'
import * as config from './config'
import { Tail } from 'tail'
import { fileStats, readBytes } from './helper/file'
import { normalizePath } from './helper/query'

interface RequestQuery {
  path?: string
  host?: string
  from?: string
}

type Request = Express.Request<null, null, null, RequestQuery>
type Response = Express.Response<any>

export const watch = async (req: Request, res: Response) => {
  try {
    if (!req.query.host) {
      const queryPath = normalizePath(req.query.path)
      const path = fsPath.join(config.directory, queryPath)
      const stats = await fileStats(path)
      if (!stats) {
        res.status(404).json({ error: `Path not found: ${req.query.path}` })
        return
      }

      const from = Math.max(0, parseInt(req.query.from, 10))
      const buffer = await readBytes(path, from, stats.size)
      res.write(buffer)

      console.info(`Watch started: ${path}`)
      let tail = new Tail(path)
      tail.on('line', (data: string) => {
        res.write(data + '\n', (error) => {
          if (error) {
            tail.unwatch()
          }
        })
      })

      const cleanup = () => {
        console.info(`Watch ended: ${path}`)
        if (tail) {
          tail.unwatch()
          tail = null
        }
      }

      tail.on('error', (e) => {
        res.write(`Tailing failed: ${e}\n`)
        res.end()
        cleanup()
      })
      req.on('close', cleanup)
      req.on('end', cleanup)

      tail.watch()
    } else {
      console.info(`Watch proxy started: ${req.query.path}`)
      const encodedPath = encodeURIComponent(req.query.path)
      const encodedFrom = encodeURIComponent(req.query.from)
      const pipedReq = request(
        `http://${req.query.host}/watch?path=${encodedPath}&from=${encodedFrom}`
      )
      const pipedRes = pipedReq.pipe(res)

      const cleanup = () => {
        console.info(`Watch proxy ended: ${req.query.path}`)
        pipedReq.abort()
        pipedReq.end()
        pipedRes.end()
        res.end()
      }

      pipedReq.on('close', cleanup)
      pipedReq.on('end', cleanup)
      req.on('close', cleanup)
      req.on('end', cleanup)
    }
  } catch (e) {
    console.error('Error watching file', e)
    res.status(500).json({ error: 'Oops! Something went wrong: ' + e })
  }
}
