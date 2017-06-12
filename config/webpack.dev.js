const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const base = require('./base')

const srcDir = path.resolve(__dirname, '..', 'src')
const distDir = path.resolve(__dirname, '..', 'dist')

console.log(base.module)
module.exports = {
  context: srcDir,

  devtool: 'source-map',

  entry: [
    // 'webpack-dev-server/client?http://localhost:3000',
    './index.js'
  ],

  output: {
    filename: 'main.bundle.js',
    path: distDir,
    publicPath: '/',
    sourceMapFilename: 'main.map',
  },

  devServer: {
    contentBase: srcDir,
    // match the output path
    publicPath: '/',
    // match the output `publicPath`
    historyApiFallback: true,
    port: 3000
  },
  module: base.module,
  plugins: [
    new webpack.NamedModulesPlugin(),

    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'index.html'),
      // where to find the html template

      path: distDir,
      // where to put the generated file

      filename: 'index.html'
      // the output file name
    }),
  ],
}
