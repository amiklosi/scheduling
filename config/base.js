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
        include: /react-select/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /react-select/,
        use: [
          'style-loader',
          cssLoaderConfig,
          'postcss-loader'
        ]
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          cssLoaderConfig,
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
