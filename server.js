const express = require('express');
const path = require('path');
const uuidV1 = require('uuid/v1');
const bodyParser = require('body-parser');

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
  console.log(req.body);
  res.send('bant');
});

app.use('/api', router);

app.use(express.static(path.join(__dirname, '/dist')));

const server = app.listen(process.env.VCAP_APP_PORT || 3000, function () {
  console.log(server);
});
