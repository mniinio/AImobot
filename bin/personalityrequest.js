module.exports = function(inputvariable) {

  var username = 'fbc9f25e-e20d-45f3-931a-129c8a4c0c54';
  var password = '51B72AkcsgOs';

  var uri = 'https://gateway-fra.watsonplatform.net/personality-insights/api/v3/profile?version=2016-10-20&consumption_preferences=true&raw_scores=true'

  // var bodytest = { 'contentItems': [{
  //   'content': 'testString',
  //   "contenttype":"text/plain",
  //   "language":"en",
  //   "created":1505653346000
  // }]};


  var options = {
    'method': 'POST',
    'uri': uri,
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
    },
    'body': inputvariable
  };

  console.log(options);
  return options;

}
