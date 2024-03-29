const path = require('path')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (vars) => {
  const env = {
    ...dotenv.config({ path: path.join(__dirname, '.env') }).parsed,
    ...{
      MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
      MAPBOX_STYLE: process.env.MAPBOX_STYLE,
      PUBLIC_BASE_PATH: process.env.PUBLIC_BASE_PATH,
    },
    ...vars,
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
    optimization: {
      nodeEnv: 'production',
      minimize: true,
      concatenateModules: true,
    },
    devtool: 'cheap-source-map',
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
          test: /\.(png|svg|jpg|jpeg|gif|webp|avif|svg|woff|woff2)$/i,
          type: 'asset',
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
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled', // disable analyser. Replace with "server" or "static" to render analyser
      })
    ],
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  }
}
