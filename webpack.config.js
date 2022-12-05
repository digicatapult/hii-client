const path = require('path')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (vars) => {
  const env = {
    ...vars,
    ...dotenv.config({ path: path.join(__dirname, '.env') }).parsed,
  }

  return {
    entry: './src/index.js',
    output: {
      path: path.join(__dirname, '/build'),
      filename: 'bundle.[contenthash].js',
      clean: true,
    },
    devServer: {
      historyApiFallback: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
          type: 'javascript/auto',
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp|avif|svg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2)$/,
          loader: 'url-loader',
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new DefinePlugin({
        'process.env': Object.keys(env).reduce((out, next) => {
          out[next] = JSON.stringify(env[next])
          return out
        }, {}),
      }),
      new DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      }),
      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'public', '*'), to: '[name][ext]' },
        ],
      }),
    ],
  }
}
