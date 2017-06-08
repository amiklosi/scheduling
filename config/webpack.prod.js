const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const srcDir = path.resolve(__dirname, '..', 'src');
const distDir = path.resolve(__dirname, '..', 'dist');

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
  // Where to fine the source code
  context: srcDir,

  // No source map for production build
  devtool: 'hidden-source-map',

  entry: [
    './index.js',
  ],

  output: {
    // The destination file name concatenated with hash (generated whenever you change your code).
    // The hash is really useful to let the browser knows when it should get a new bundle or use the one in cache
    filename: 'main-[hash].js',

    // The destination folder where to put the output bundle
    path: distDir,

    // Wherever resource (css, js, img) you call <script src="..."></script>,
    // or css, or img use this path as the root
    publicPath: '/',

    // At some point you'll have to debug your code, that's why I'm giving you
    // for free a source map file to make your life easier
    // sourceMapFilename: 'main-[hash].map',
  },

  // The devServer config is here to enable you to run the production build. I know you wanna see
  // the output of this awesome config with me (Webpack 2).
  devServer: {
    contentBase: distDir,
    historyApiFallback: true,
    port: 3000,
    compress: true,
    inline: false
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
        test: /\.scss/,
        use: [
          'style-loader',
          cssLoaderConfig,
          'sass-loader',
        ]
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new HtmlWebpackPlugin({
      // where to find the html template
      template: path.join(srcDir, 'index.html'),

      // where to put the generated file
      path: distDir,

      // the output file name
      filename: 'index.html'
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   beautify: false,
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: true
    //   },
    //   compress: {
    //     screw_ie8: true
    //   },
    //   comments: false
    // })
  ],
};
