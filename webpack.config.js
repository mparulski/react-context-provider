const path = require('path');

module.exports = {
  entry: './src/contextProviderFactory.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'contextProviderFactory.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    react: 'commonjs react'
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.jsx?$/,
        use: 'babel-loader'
      }
    ]
  }
}