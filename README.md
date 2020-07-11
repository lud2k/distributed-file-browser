[![react version](https://img.shields.io/badge/React-16.13-green.svg?style=flat-square)](https://github.com/facebook/react/)
[![typescript version](https://img.shields.io/badge/TypeScript-3.9.5-green.svg?style=flat-square)](https://www.typescriptlang.org/)
[![materialui version](https://img.shields.io/badge/MaterialUI-4.10.1-green.svg?style=flat-square)](https://material-ui-next.com/)


Distributed File Browser is a web UI allowing easy access to files from one or many servers.

Features:
- Easy browsing of files and directories
- Watch files for changes (like `tail -f` but in the web UI)
- Merge directories from different servers
- Download files

## Screenshots

<img src="https://github.com/lud2k/distributed-file-browser/blob/master/docs/screen-1.png?raw=true" width="300" /> <img src="https://github.com/lud2k/distributed-file-browser/blob/master/docs/screen-2.png?raw=true" width="300" />


## Setup

### Kubernetes

This project contains kubernetes yaml files that can help you deploy this service. Those yamls
create a DaemonSet that exposes files from a specific directory on all kube nodes. The use case
is providing easy access to logs written to disk. In our case, all pods write logs to disk to a
common directory. This allows us to see all logs very easily (and tail them). It also allows us
to see logs of pods that have died.

<img src="https://github.com/lud2k/distributed-file-browser/blob/master/docs/daemonset.png?raw=true" width="300" />

This project contains kubernetes yaml files to deploy this service:
1. `kubernetes/role.yml` / `kubernetes/role-binding.yml` / `kubernetes/service-account.yml`:
  Creates a role and service account that grants the DaemonSet permissions to list pods. Pods will
  use this role to discover other pods to get files from.
  Those files can be applied as is.
2. `kubernetes/daemonset.yml`:
  Creates a DaemonSet that will run the distributed file browser server. Ideal if you have
  a folder in each Kubernetes node that you would like to expose through a web UI.
3. `kubernetes/service.yml` / `kubernetes/ingress.yml`:
  Exposes the service so that it can easily be accessed.

### Manual

Following the following steps:
1. Make sure you have node 12 or greater installed.
2. Install the project's dependencies: `npm install`.
3. Set environment variables described in the Configuration section below.
4. Run the server: `node dist/backend.js`.


## Configuration

Config values can be provided as environment variables.

#### General

- `MODE` (required): 
  - `kubernetes`: for using kubernetes APIs to discover other hosts
  - `ips`: for manually providing hosts IPs
- `HOST` (required): The `IP:PORT` of the current instance. This is what other instances will use
  to communicate with this one.
- `SERVER_PORT`: Port number the web server is running on (default: 3000).
- `FILE_STAT_POOL_SIZE`: Number of threads that will get file stats (size, type, ..) (default: 25).
- `FILE_PREVIEW_SIZE`: Max number of bytes to read from the head or tail of files for file preview (default: 100000).
- `ROOT_DIR_NAME`: Name to display for the root directory in the UI (default: root)
- `TITLE`: Title of the web UI (default: File Browser)

#### MODE=kubernetes

- `APP_NAME`: If `MODE=kubernetes`, The name of the kubernetes pods (default: file-browser)
- `NAMESPACE`: If `MODE=kubernetes`, The name of the namespace in which the pods are running
  (default: logging)

#### MODE=ips

- `HOSTS` (required): If `MODE=ips`, A comma separated list of hosts running this service
  (e.g. `HOST:IP,HOST:IP`)


## Development

### Building

- `npm run build:backend` builds the backend
- `npm run build:frontend` builds the frontend

### Watch & Build (dev)

- `npm run dev:backend` builds, run and watch the backend
- `npm run dev:frontend` builds, run and watch the frontend
