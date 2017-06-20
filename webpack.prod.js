var config = require('./webpack.config.js');
var webpack = require('webpack');

if (process.env.NODe_ENV === 'preprod') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('preprod'),
        'WEBSITE_URL': JSON.stringify('http://rpcentre-indev.bancey.xyz'),
        'APP_PORT': '8080'
      }
    })
  );
} else {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'WEBSITE_URL': JSON.stringify('http://rpcentre-indev.bancey.xyz'),
        'APP_PORT': '8080'
      }
    })
  );
}


module.exports = config;
