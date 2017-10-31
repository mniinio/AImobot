module.exports = function(inputvariable, accesstoken) {

  var uri = 'https://api.spotify.com/v1/recommendations?seed_genres=' + inputvariable + '&min_popularity=50&market=FI&access_token=' + accesstoken;

  var options = {
    'method': 'GET',
    'uri': uri
  };

  return options;

}
