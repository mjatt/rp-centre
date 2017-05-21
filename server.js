const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const cookieParser = require('cookie-parser');
const firebase = require('firebase');

firebase.initializeApp({
  databaseURL: 'https://norrland-rp-centre.firebaseio.com/'
});

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
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    }
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// eslint-disable-next-line new-cap
var router = express.Router();

router.route('/event/create').post(function (req, res) {
  firebase.database().ref('/events/' + req.body.title).set({
    channel: req.body.channel,
    createdBy: req.body.createdBy,
    createdOn: req.body.createdOn,
    description: req.body.description,
    title: req.body.title
  });
  res.send('Success!');
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
        getFlagUrl(req.body.nation, function (flagUrl) {
          firebase.database().ref('nations/' + req.body.nation).set({
            flag: flagUrl
          });
        });
        res.cookie('nation', req.body.nation);
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
  console.log('RP centre running on port ' + server.address().port);
});

function getFlagUrl(nation, callback) {
  let url = 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nation + '&q=flag';
  var options = {
    url: url,
    headers: {
      'User-Agent': 'Norrland RP Centre'
    }
  };

  request(options, function (error, response, body) {
    if (error) console.log(error);
    let parts = body.split('FLAG');
    callback(parts[1].replace('</', '').replace('>', ''));
  });
}
