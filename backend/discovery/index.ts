import * as config from '../config'
import { getHosts as getKubeHosts } from './kubernetes'
import { getHosts as getEnvHosts } from './ips'

export const getHosts = async (): Promise<string[]> => {
  if (config.discoveryMode === 'kubernetes') {
    return getKubeHosts()
  } else if (config.discoveryMode === 'ips') {
    return getEnvHosts()
  } else {
    throw new Error('Unknown discovery mode: ' + config.discoveryMode)
  }
}
