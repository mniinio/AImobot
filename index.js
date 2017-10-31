var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var app = express();
var port = 8888;
var uuid = require('uuid');
var bodyParser = require('body-parser')
require('dotenv').config();

var client_id = process.env.client_id; // Your client id
var client_secret = process.env.client_secret; // Your secret
var redirect_uri = process.env.redirect_uri; // Your redirect uri

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.use(express.static(__dirname + '/public'))
   .use(cookieParser())
  //  .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }));

app.get('/login', function(req,res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));

});

app.get('/getgenres', function(req, res) {

  var accesstoken = req.query.access_token;
  var uri = 'https://api.spotify.com/v1/recommendations/available-genre-seeds?access_token=' + accesstoken;

  var options = {
    'method': 'GET',
    'uri': uri
  };

  request(options,function(error, response, body) {
    if (error) {
      console.log(error.message);
    }
    jsonContent = JSON.parse(body);
    var htmlmessage = '';
    var paging = 1;
    for (var index in jsonContent.genres){
      htmlmessage = htmlmessage + '<input type="checkbox" name="' + 'seed_genres' +
       '" value="' + jsonContent.genres[index] + '">' + jsonContent.genres[index] + '         ';
      paging = paging + 1;
      if (paging > 8) {
        htmlmessage = htmlmessage + '<br>';
        paging = 1
      }
    }
    htmlmessage = htmlmessage + '';
    res.send(htmlmessage);

  });

});

app.get('/get-twitter', function(req, res) {


  var additionalText = req.query.profile
  var twitterhandle = req.query.thandle;
  var request = require('request');
  var twitterrequest = require('./bin/tweetrequest');
  var parsetweet = require('./bin/parsetweet');
  var personalityrequest = require('./bin/personalityrequest');
  var parsepersonalityresponse = require('./bin/parsepersonality');
  var preparespotifyrequest = require('./bin/spotifyrequest');
  var accesstoken = req.query.access_token;

  // console.log(accesstoken);
  var seed_genres_used = '';
  var seed_genres_default = 'Seed genres used:';
  var aimessage = '';

  const twitterMessage = function() {
    var options = twitterrequest(twitterhandle);
    return new Promise(function(resolve, reject) {
      if (twitterhandle != '') {
        request(options,function(error, response, body) {
          if (error) {
            message = error.message;
          }
          var message = parsetweet(JSON.parse(body));
          resolve(message)
        });
      } else {
        console.log('creating empty data');
        var emptydata = {};
        var key = 'contentItems';
        emptydata[key] = [];
        resolve(JSON.stringify(emptydata))
      }
    });
  };

  const preparerequest = function(options) {
    return Promise.resolve(personalityrequest(options));
  };

  const personalityinsights = function(persOptions) {
    // return Promise.resolve(persOptions);
    return new Promise(function(resolve, reject) {
      request(persOptions,function(error, response, body) {
        if (error) {
          resolve(error.message)
        }
        console.log(body);
        var message = parsepersonalityresponse(JSON.parse(body));
        if (message.substring(0,3) === '400') {
          var mesLen = message.length + 2;
          aimessage = 'Message from Artificial Intelligence: ' + message.substring(4, mesLen) + '<br><br>';
          message = 'rock,alternative';
          seed_genres_default = 'AImo could not find your preferences. AIMo likes these, maybe you would too: ';
        }
        seed_genres_used = message;

        resolve(message)
      });
    });
  };

  const addMessage = function(twittermessage) {
    return new Promise(function(resolve,reject) {
      if (additionalText != '') {
        console.log(additionalText);
        console.log(twittermessage);
        var additionalData = {
          'content': additionalText,
          'contenttype': 'text/plain',
          'language': 'en',
          'created': Date.parse(new Date())
        }
        var tempJson = JSON.parse(twittermessage)
        tempJson['contentItems'].push(additionalData);

        console.log(tempJson);
        resolve(JSON.stringify(tempJson))
      } else {
        resolve(twittermessage)
      }
    });
  };

  const spotifyrequest = function(personalTaste) {

    return Promise.resolve(preparespotifyrequest(personalTaste, accesstoken));
  };

  const spotifyrecommendations = function(spotifyOptions) {
    // return Promise.resolve(persOptions);
    return new Promise(function(resolve, reject) {
      request(spotifyOptions,function(error, response, body) {
        if (error) {
          resolve(error.message)
        }
        //var message = parsepersonalityresponse(JSON.parse(body));
        jsonContent = JSON.parse(body);
        var htmlmessage = '<h2>' + aimessage + seed_genres_default + seed_genres_used + '</h2>';
        for (var index in jsonContent.tracks){
          if (jsonContent.tracks[index].name == null) {
            data = {};
          } else {
            htmlmessage = htmlmessage + '<a href="' + jsonContent.tracks[index].external_urls.spotify + '"><img src="' + jsonContent.tracks[index].album.images[1].url + '" style="width:220px;height:220px;"></a>';
          }
        }
        htmlmessage = htmlmessage + '<br><br><a href="/" class="btn btn-primary">Back</a>';

        if (htmlmessage == '') {
          htmlmessage = '<h1>nothing found</h1>';
        }

        resolve(htmlmessage)
      });
    });
  };

  twitterMessage().then(addMessage).then(preparerequest).then(personalityinsights).then(spotifyrequest).then(spotifyrecommendations).then(respond => {
    //console.log(respond);
    res.type('text/html');
    res.set('Content-Length', Buffer.byteLength(respond));
    res.status(200).send(respond);
  });


});

app.post('/getsong', function(req, res) {

  var isArray = require('isarray');

  var seed_genres = '';

  if (isArray(req.body.seed_genres)) {
    for (var index in req.body.seed_genres) {
        seed_genres = seed_genres + req.body.seed_genres[index] + ',';
    }
    seed_genres = seed_genres.slice(0, -1);
  } else {
    seed_genres = req.body.seed_genres
  }

  var accesstoken = req.body.access_token;

  var querystring = seed_genres == undefined
      ? '&seed_tracks=' + req.body.track
      : '&seed_genres=' + seed_genres;

  var uri = 'https://api.spotify.com/v1/recommendations?' + querystring + '&min_popularity='+ req.body.popularity +'&market='+ req.body.market +'&access_token=' + accesstoken;

  var options = {
    'method': 'GET',
    'uri': uri
  };


  request(options,function(error, response, body) {
    if (error) {
      console.log(error.message);
    }
    jsonContent = JSON.parse(body);
    var htmlmessage = '';
    for (var index in jsonContent.tracks){
      if (jsonContent.tracks[index].name == null) {
        data = {};
      } else {
        htmlmessage = htmlmessage + '<a href="' + jsonContent.tracks[index].external_urls.spotify + '"><img src="' + jsonContent.tracks[index].album.images[1].url + '" style="width:220px;height:220px;"></a>';
      }
    }
    htmlmessage = htmlmessage + '';

    if (htmlmessage == '') {
      res.send('<h1>nothing found</h1>');
    } else {
      res.send(htmlmessage);
    }

  });

});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {});

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on ' + port);
app.listen(process.env.PORT || port);
