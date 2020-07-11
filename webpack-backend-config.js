const nodeExternals = require('webpack-node-externals')
const { spawn } = require('child_process')

const backendConfig = {
  entry: './backend/main.ts',
  target: 'node',
  mode: process.env.DEV === 'true' ? 'development' : 'production',
  node: {
    __dirname: false,
  },
  output: {
    path: __dirname + '/dist',
    filename: 'backend.js',
  },
  resolve: {
    extensions: ['.ts', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: __dirname + '/backend/tsconfig.json',
        },
      },
    ],
  },
  externals: [nodeExternals()],
}

module.exports = backendConfig

if (
  process.env.npm_lifecycle_script &&
  process.env.npm_lifecycle_script.includes('webpack --watch')
) {
  spawn('nodemon', ['dist/backend.js'], { stdio: 'inherit' })
}
