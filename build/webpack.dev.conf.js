const path     = require('path');
module.exports = {
  entry: './src/index.js',

  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'H.js',
    libraryTarget: 'umd',
    library: 'H'
  },

  resolve: {
    extensions: ['.js'],
  },

  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
    ]
  },

  devtool: '#cheap-module-eval-source-map',

  mode: 'development'
};


