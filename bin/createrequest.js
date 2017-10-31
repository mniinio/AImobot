module.exports = function(string, uuid) {

  var username = '075bcbd9-e7fa-4545-a46c-fcdcddd7106a';
  var password = 'fMPnGEwOxam5';

  var uri = 'https://gateway-fra.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19&text=' + string
  var options = {
    'method': 'GET',
    'uri': uri,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
    }
  };

  return options;
}
