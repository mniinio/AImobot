module.exports = function(options) {

  /*return options;*/
  var parsemessage = require('./parsepersonality');
  var request = require('request');
  /*var callback = function (error, response, body) {

    if (error) {
      message = error.message;
    }
    var jsonContent = JSON.parse(body);
    message = parsemessage(jsonContent);

    return message;

  };*/

  request(options,function(body) {
    console.log('test');
    return JSON.stringify(body);
  }
  );

}
