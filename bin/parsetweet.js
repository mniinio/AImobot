module.exports = function(jsonContent) {
  var returnJson = {};
  var key = 'contentItems';
  returnJson[key] = [];
  var returnRaw = false;
  var data = {};

  for (var index in jsonContent.statuses){
    if (jsonContent.statuses[index].text == null) {
      data = {};
    } else {
      data = {
        'content': jsonContent.statuses[index].text,
        'contenttype': 'text/plain',
        'language': 'en',
        'created': Date.parse(jsonContent.statuses[index].created_at)
      }
    }
    returnJson[key].push(data);
  }

  if (returnRaw == true) {
    return JSON.stringify(jsonContent)
  } else {
    return JSON.stringify(returnJson);
  }

}
