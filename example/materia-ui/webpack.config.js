'use strict';
var path = require('path');

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: './static/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js'],
    root: [
      path.join(__dirname, 'src'),
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      }
    ]
  }
};
