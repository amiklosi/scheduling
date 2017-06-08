const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const srcDir = path.resolve(__dirname, '..', 'src')
const distDir = path.resolve(__dirname, '..', 'dist')

var cssLoaderConfig = {
  loader: 'css-loader',
  options: {
    modules: true,
    sourceMap: true,
    importLoaders: 1,
    localIdentName: '[name]--[local]--[hash:base64:8]'
  }
}

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

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          cssLoaderConfig,
          'sass-loader',
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 10000, // use data url for assets <= 10KB
          name: 'assets/[name].[hash].[ext]'
        },
      },
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
