const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const cookieParser = require('cookie-parser');
const firebase = require('firebase');
var parseString = require('xml2js').parseString;

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
  let flag;
  firebase.database().ref('/nations/' + req.body.createdBy).once('value').then(function (snapshot) {
    flag = snapshot.val().flag;
    firebase.database().ref('/events/' + req.body.title).set({
      channel: req.body.channel,
      createdBy: req.body.createdBy,
      createdOn: req.body.createdOn,
      description: req.body.description,
      title: req.body.title,
      flag: flag
    });
    res.send('Success!');
  });
});

router.route('/event/comment').post(function (req, res) {
  let rightNow = new Date().getTime();
  firebase.database().ref('/events/' + req.body.event + '/comments/' + rightNow).set({
    createdOn: req.body.createdOn,
    message: req.body.message,
    nation: req.body.nation
  });
  res.send('Success');
});

router.route('/verify').post(function (req, res) {
  let verifyUrl = 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + req.body.nation + '&checksum=' + req.body.code + '&token=' + SITE_CODE;
  let nationCheckUrl = 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + req.body.nation + '&q=region';

  var verifyOptions = {
    url: verifyUrl,
    headers: {
      'User-Agent': 'Norrland RP Centre'
    }
  };
  var nationCheckOptions = {
    url: nationCheckUrl,
    headers: {
      'User-Agent': 'Norrland RP Centre'
    }
  };
  request(verifyOptions, function (error, response, body) {
    if (!error) {
      let nation = req.body.nation.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      nation = nation.replace('%20', '_');
      nation = nation.replace(' ', '_');
      if (parseInt(body, 10) === 1) {
        request(nationCheckOptions, function (nationCheckError, nationCheckResponse, nationCheckBody) {
          if (nationCheckError) console.error(error);
          parseString(nationCheckBody, function (err, result) {
            if (err) console.error(err);
            if (result.NATION.REGION[0] !== 'Norrland') {
              res.status(400).send('Error... You are not a member of Norrland...');
              console.error('User: ' + nation + ' attempted to login but it not a member of Norrland!');
            } else {
              getFlagUrl(req.body.nation, function (flagUrl) {
                firebase.database().ref('nations/' + nation).set({
                  flag: flagUrl
                });
              });
              res.cookie('nation', nation);
              res.send('Signed in successfully, you will be redirected in 3 seconds...');
              console.log('User: ' + nation + ' signed in successfully.');
            }
          });
        });
      } else {
        res.status(400).send('Please make sure you got your verification code correct and try again...');
        console.error('user: ' + nation + ' failed to login.');
      }
    } else {
      res.status(400).send('A unexpected error occured, please try again later...');
      console.error('Ran into an error: ' + error);
      console.error(error);
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
