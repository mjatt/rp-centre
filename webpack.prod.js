var config = require('./webpack.config.js');
var webpack = require('webpack');
var appConfig = require('config');

var WEBSITE_URL = appConfig.get('App.URL');
var CODE = appConfig.get('NationStates.APP_CODE');

console.log(`Pushing the following variables to the bundle\r\nNODE_ENV=${process.env.NODE_ENV}  WEBSITE_URL=${WEBSITE_URL}  CODE=${CODE}`);

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'WEBSITE_URL': JSON.stringify(WEBSITE_URL),
      'CODE': JSON.stringify(CODE)
    }
  })
);

module.exports = config;
