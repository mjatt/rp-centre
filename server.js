const express = require('express');
const path = require('path');
const uuidV1 = require('uuid/v1');
const bodyParser = require('body-parser');
const request = require('request');

const SITE_CODE = process.env.CODE || 'norrland-rp';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config');
  var compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    filename: webpackConfig.output.filename,
    stats: {
      colors: true
    },
    historyApiFallback: true
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// eslint-disable-next-line new-cap
var router = express.Router();

router.route('/generate_code').get(function (req, res) {
  res.send(uuidV1());
});

router.route('/verify').post(function (req, res) {
  let url = 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + req.body.nation + '&checksum=' + req.body.code + '&token=' + SITE_CODE;

  var options = {
    url: url,
    headers: {
      'User-Agent': 'Norrland RP Centre'
    }
  };
  request(options, function (error, response, body) {
    if (!error) {
      if (parseInt(body, 10) === 1) {
        res.send('Success');
      } else {
        res.status(400).send('Failure');
      }
    } else {
      res.status(400).send(error);
    }
  });
});

app.use('/api', router);

app.use(express.static(path.join(__dirname, '/dist')));

const server = app.listen(process.env.APP_PORT || 3000, function () {
  console.log(server);
});
