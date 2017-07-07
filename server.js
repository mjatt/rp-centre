const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const cookieParser = require('cookie-parser');
const firebase = require('firebase');
var parseString = require('xml2js').parseString;
const helmet = require('helmet');
const config = require('config');

var APP_PORT = config.get('App.PORT');

firebase.initializeApp({
  databaseURL: 'https://norrland-rp-centre.firebaseio.com/'
});

const SITE_CODE = process.env.CODE || 'norrland-rp';

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'preprod') {
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

router.route('/event').post(function (req, res) {
  let flag;
  let rightNow = new Date().getTime();
  firebase.database().ref('/nations/' + req.body.createdBy).once('value').then(function (snapshot) {
    flag = snapshot.val().flag;
    firebase.database().ref('/events/' + rightNow).set({
      channel: req.body.channel,
      createdBy: req.body.createdBy,
      createdOn: req.body.createdOn,
      description: req.body.description,
      title: req.body.title,
      flag: flag
    });
    res.send('Event created successfully...');
  });
  console.log(new Date() + ': Event created.');
});

router.route('/event').delete(function (req, res) {
  firebase.database().ref('/events/' + req.query.event).remove().then(function () {
    res.send('Event deleted successfully...');
  }).catch(function () {
    res.status(500).send('There was a problem deleting the event, please try again...');
  });
  console.log(new Date() + ': Event, ' + req.query.event + ', was deleted.');
});

router.route('/event').patch(function (req, res) {
  firebase.database().ref('/events/' + req.body.eventKey).update({
    title: req.body.eventTitle,
    description: req.body.eventDescription,
    channel: req.body.eventChannel
  });
  res.send('Event updated successfully...');
  console.log(new Date() + ': Event, ' + req.body.eventKey + ', was modified.');
});

router.route('/event/comment').post(function (req, res) {
  let rightNow = new Date().getTime();
  firebase.database().ref('/events/' + req.body.event + '/comments/' + rightNow).set({
    createdOn: req.body.createdOn,
    message: req.body.message,
    nation: req.body.nation
  });
  res.send('Commented successfully...');
  console.log(new Date() + ': Event, ' + req.body.event + ', was commented on by ' + req.body.nation + '.');
});

router.route('/calc/budget').post(function (req, res) {
  firebase.database().ref('nations/' + req.body.nation).update({
    remainingBudget: req.body.remainingBudget,
    military: req.body.items,
    budget: req.body.budget
  }).then(function () {
    res.send('Military items successfully purchased...');
  }).catch(function () {
    res.status(500).send('Something went wrong, please try again...');
  });
});

router.route('/calc/data').get(function (req, res) {
  let censusUrl = 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + req.query.nation + ';q=census;scale=52+46+1;mode=score';

  var censusOptions = {
    url: censusUrl,
    headers: {
      'User-Agent': 'Norrland RP Centre'
    }
  };
  request(censusOptions, function (error, response, body) {
    if (!error) {
      parseString(body, function (err, result) {
        if (err) console.error(err);
        /* var economy = Math.round(result.NATION.CENSUS[0].SCALE[0].SCORE[0]);
        var defense = Math.round(result.NATION.CENSUS[0].SCALE[1].SCORE[0]);
        var integrity = Math.round(result.NATION.CENSUS[0].SCALE[2].SCORE[0]);

        var physicalStrength = Math.sqrt((defense * 2) * (economy / 100) * req.query.population);
        var integrityModifier = (integrity + 20) / 120;
        var budget = 30 * integrityModifier * physicalStrength;
        budget = Math.round(budget); */

        var pop = req.query.population;
        var eco = result.NATION.CENSUS[0].SCALE[0].SCORE[0];
        var def = result.NATION.CENSUS[0].SCALE[1].SCORE[0];
        var inte = result.NATION.CENSUS[0].SCALE[2].SCORE[0];
        if (pop < 0) {
          pop = 0;
        }
        if (eco < 0) {
          eco = 0;
        }
        if (def < 0) {
          def = 0;
        }
        if (inte < 0) {
          inte = 0;
        }
        var scale = 75000.0;
        var factor = pop / scale;
        var position = (Math.sqrt(8.0 * factor + 1.0) - 1.0) / 2.0;
        var physicalStrength = Math.sqrt((def * 2.0) * (eco / 100.0) * (position * scale));
        var integrityModifier = (inte + 20.0) / 120.0;
        var prelimBudget = 30.0 * physicalStrength * integrityModifier;
        var budget = Math.round(prelimBudget);

        var baseRef = 'nations/' + req.query.nation;
        firebase.database().ref(baseRef).update({
          budget: budget,
          population: pop
        });
        firebase.database().ref(baseRef + '/military').remove();
        firebase.database().ref(baseRef + '/remainingBudget').remove();
        res.send('Budget calculated successfully, your budget is ' + budget);
        console.log(new Date() + ': User, ' + req.query.nation + ', calculated their budget.');
      });
    } else {
      res.status(400).send('An error occured, please check the information provided and try again.');
      console.log(new Date() + ': User, ' + req.query.nation + ', failed to calculate their budget.');
    }
  });
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
      nation = replaceAll(nation, '%20', '_');
      nation = replaceAll(nation, ' ', '_');
      if (parseInt(body, 10) === 1) {
        request(nationCheckOptions, function (nationCheckError, nationCheckResponse, nationCheckBody) {
          if (nationCheckError) console.error(error);
          parseString(nationCheckBody, function (err, result) {
            if (err) console.error(err);
            if (result.NATION.REGION[0] !== 'Norrland') {
              res.status(400).send('Error... You are not a member of Norrland...');
              console.error(new Date() + ': User, ' + nation + ', attempted to login but it not a member of Norrland!');
            } else {
              checkIfUserExists(nation, function (checkFlagResult, nationData) {
                if (!checkFlagResult) {
                  console.log('Creating ' + nation + '\'s user data...');
                  getFlagUrl(req.body.nation, function (flagUrl) {
                    firebase.database().ref('nations/' + nation).set({
                      flag: flagUrl,
                      isAdmin: false
                    });
                  });
                } else if (checkFlagResult && nationData.isAdmin) {
                  console.log(new Date() + ': User, ' + nation + ', is an admin');
                  res.cookie('isAdmin', true);
                }
                res.cookie('nation', nation);
                res.send('Signed in successfully, you will be redirected in 3 seconds...');
                console.log(new Date() + ': User, ' + nation + ', signed in successfully.');
              });
            }
          });
        });
      } else {
        res.status(400).send('Please make sure you got your verification code correct and try again...');
        console.error(new Date() + ': User, ' + nation + ', failed to login.');
      }
    } else {
      res.status(400).send('A unexpected error occured, please try again later...');
      console.error('Ran into an error: ' + error);
    }
  });
});

app.use('/api', router);

app.use(express.static(path.join(__dirname, '/dist')));

if (process.env.NODE_ENV === 'production') {
  let options = {
    key: fs.readFileSync('/etc/letsencrypt/live/rpcentre.bancey.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rpcentre.bancey.xyz/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/rpcentre.bancey.xyz/chain.pem')
  };
  https.createServer(options, app).listen(443);
  http.createServer(app).listen(APP_PORT || 3000);
  console.log(`RP Centre is coming up in PRODUCTION mode on port ${APP_PORT || 3000} and 443`);
} else {
  http.createServer(app).listen(APP_PORT || 3000);
  console.log(`RP Centre is coming up in DEVELOPMENT mode on port ${APP_PORT || 3000}`);
}

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

function checkIfUserExists(nation, callback) {
  firebase.database().ref('nations/' + nation).once('value').then(function (snapshot) {
    var values = snapshot.val();
    if (values && values.flag) {
      callback(true, values);
    } else {
      callback(false, values);
    }
  });
}

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}
