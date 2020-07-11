import * as k8s from '@kubernetes/client-node'
import * as config from '../config'

// Prepare a kube client
const kc = new k8s.KubeConfig()
kc.loadFromDefault()
const k8sApi = kc.makeApiClient(k8s.CoreV1Api)

export const getHosts = async (): Promise<string[]> => {
  const response = await k8sApi.listNamespacedPod(
    config.namespace,
    undefined,
    undefined,
    undefined,
    undefined,
    `name=${config.appName}`
  )
  return response.body.items
    .filter((item) => item.status?.phase === 'Running')
    .map((item) => `${item.status.podIP}:${config.serverPort}`)
}
