'use strict';

module.exports = {
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
