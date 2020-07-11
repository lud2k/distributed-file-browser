export interface Node {
  type: 'directory' | 'file'
  name: string
  modifiedAt: number
  createdAt: number
  size: number
  path: string
  host: string
}

export interface Failure {
  error: string
}

export interface File extends Node {
  type: 'file'
}

export interface Directory extends Node {
  type: 'directory'
  nodes?: Node[]
}

export interface MergedNode {
  type: 'directory' | 'file'
  name: string
  modifiedAt: number
  createdAt: number
  size: number
  path: string
  host: string[]
}
