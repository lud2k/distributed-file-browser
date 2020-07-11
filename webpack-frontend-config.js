const path = require('path')

const frontendConfig = {
  entry: './frontend/index.tsx',
  target: 'web',
  mode: process.env.DEV === 'true' ? 'development' : 'production',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'frontend.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: __dirname + '/frontend/tsconfig.json',
        },
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}

module.exports = frontendConfig
