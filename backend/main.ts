import * as Express from 'express'
import { download } from './download'
import { localNode } from './local'
import { index } from './index'
import { clusterNodes } from './cluster'
import * as config from './config'
import { watch } from './watch'
import { file } from './file'

// Create web app
const app = Express()
app.get('/local-node', localNode)
app.get('/cluster-nodes', clusterNodes)
app.get('/download', download)
app.get('/watch', watch)
app.get('/file', file)
app.get('/', index)
app.use(Express.static('dist'))

// Starting web app
console.info(`Starting server http://127.0.0.1:${config.serverPort}/`)
app.listen(config.serverPort)
