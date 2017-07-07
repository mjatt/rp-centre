var config = require('./webpack.config.js');
var webpack = require('webpack');
var appConfig = require('config');

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'WEBSITE_URL': JSON.stringify(appConfig.get('App.URL')),
      'CODE': JSON.stringify(appConfig.get('NationStates.APP_CODE'))
    }
  })
);

module.exports = config;
