var config = require('./webpack.config.js');
var webpack = require('webpack');

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('preprod'),
      'WEBSITE_URL': JSON.stringify('http://rpcentre-indev.bancey.xyz'),
      'APP_PORT': '8080'
    }
  })
);

module.exports = config;
