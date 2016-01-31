'use strict';

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: './static/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        // .jsxと.jsを対象にする
        test: /\.jsx?$/,
        // node_modulesを除く
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      }
    ]
  }
};
