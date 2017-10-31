module.exports = function(jsonContent, uuid) {

  var returnJson = {};
  var key = 'contentItems';
  returnJson[key] = [];
  for (var index in jsonContent.document_tone.tone_categories){
    if (jsonContent.document_tone.tone_categories[index].category_id == null) {
      var data = {};
      returnJson[key].push(data);
    } else {
      for (var i in jsonContent.document_tone.tone_categories[index].tones) {
        var data = {
          'uuid': uuid,
          'tone_id': jsonContent.document_tone.tone_categories[index].tones[i].tone_id,
          'data': jsonContent.document_tone.tone_categories[index].tones[i].score,
          'category_id': jsonContent.document_tone.tone_categories[index].category_id,
          'category_name': jsonContent.document_tone.tone_categories[index].category_name,
          'contenttype': 'text/plain'
        }
        returnJson[key].push(data);
      }
    }
  };
  return JSON.stringify(returnJson);
}
