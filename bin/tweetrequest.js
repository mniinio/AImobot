module.exports = function(twitterhandle) {

  var qs = require('querystring');
  var resultType = '&result_type=popular';

  var uri = 'https://api.twitter.com/1.1/search/tweets.json?q=' + qs.escape('from:' + twitterhandle) + '&count=100';

  console.log (uri);

  var options = {
    method: 'GET',
    uri: uri,
    oauth: {
      consumer_key: 'liAWAbiQrWFlrkuABpmuIfoOi',
      consumer_secret: 'BMNvaktaAW4p5uxK2ONtI1OUHstrGpgs6c6koRyrZ4BmZzWqPR',
      token: '1269070219-MLZ1uFZtjivGvdByrjyce2iNVbZDIYRLI723SJl',
      token_secret: 'zegLjvpKQIbHke9Eoe2WJ4eYJqgZAcEJG71lt1mvXObBw'
    }
  };

  return options;
}
