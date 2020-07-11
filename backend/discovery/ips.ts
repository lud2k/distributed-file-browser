import * as config from '../config'

export const getHosts = async (): Promise<string[]> => {
  return config.hosts.split(',')
}
