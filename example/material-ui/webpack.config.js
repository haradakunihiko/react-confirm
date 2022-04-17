'use strict';
var path = require('path');

module.exports = {
  entry: [
    './src/index'
  ],
  mode: 'production',
  output: {
    path: __dirname + '/static',
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'react-confirm': path.resolve(__dirname, '../../src'),

      // Ensure only the local copy of React is used
      'react': path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
           loader: 'babel-loader',
           options: {
             presets: ['@babel/preset-env', '@babel/preset-react']
           }
        },
      }
    ]
  }
};
