import * as Express from 'express'
import fetch from 'node-fetch'
import { Failure, Node } from './types'
import { getHosts } from './discovery'
import { normalizePath } from './helper/query'

interface RequestQuery {
  path?: string
}

interface ResponseBody {
  nodes?: Node[]
  errors?: string[]
  error?: string
}

type Request = Express.Request<null, null, null, RequestQuery>
type Response = Express.Response<ResponseBody>

export const getNodesFromHost = async (host: string, path: string): Promise<Node | Error> => {
  try {
    const encodedPath = encodeURIComponent(path)
    const localNodeResponse = await fetch(`http://${host}/local-node?path=${encodedPath}`)
    if (localNodeResponse.status === 200) {
      const response = await localNodeResponse.json()
      return response.node
    } else if (localNodeResponse.status !== 404) {
      return new Error(`Request to ${host} failed with status ${localNodeResponse.status}`)
    }
  } catch (e) {
    return new Error(`Request to ${host} failed with error ${e.message}`)
  }
}

export const clusterNodes = async (req: Request, res: Response) => {
  try {
    const queryPath = normalizePath(req.query.path)
    const hosts = await getHosts()
    const results = await Promise.all(hosts.map((host) => getNodesFromHost(host, queryPath)))
    const nodes = results.filter((node) => node && !(node instanceof Error)) as Node[]
    const errors = results.filter((node) => node instanceof Error).map((err: Error) => err.message)
    res.json({ nodes, errors })
  } catch (e) {
    console.error('Error getting cluster nodes', e)
    res.json({ error: e.message })
  }
}
