module.exports = function(jsonContent) {

  console.log('parsepersonality');

  // var returnJson = {};
  // var key = 'MusicPreferences';
  // returnJson[key] = [];
  var returnRaw = false;
  // var data = {};
  var returnString = '';
  if (jsonContent.code === 400) {
    var returnString = jsonContent.code + ' ' + jsonContent.error;
  } 

  for (var index in jsonContent.consumption_preferences){
    if (jsonContent.consumption_preferences[index].consumption_preference_category_id == null) {
      // data = {};
      // returnJson[key].push(data);
      returnString = '';
    } else if (jsonContent.consumption_preferences[index].consumption_preference_category_id == 'consumption_preferences_music') {
      for (var consindex in jsonContent.consumption_preferences[index].consumption_preferences) {
        if (jsonContent.consumption_preferences[index].consumption_preferences[consindex].score == '1') {
          switch(jsonContent.consumption_preferences[index].consumption_preferences[consindex].consumption_preference_id) {
            case 'consumption_preferences_music_rap':
              returnString = returnString + 'hip-hop' + ',';
              break;
            case 'consumption_preferences_music_country':
              returnString = returnString + 'country' + ',';
              break;
            case 'consumption_preferences_music_r_b':
              returnString = returnString + 'r-n-b' + ',';
              break;
            case 'consumption_preferences_music_hip_hop':
              returnString = returnString + 'house' + ',';
              break;
            case 'consumption_preferences_music_live_event':
              returnString = returnString + 'indie' + ',';
              break;
            case 'consumption_preferences_music_playing':
              returnString = returnString + 'singer-songwriter' + ',';
              break;
            case 'consumption_preferences_music_latin':
              returnString = returnString + 'latin' + ',';
              break;
            case 'consumption_preferences_music_rock':
              returnString = returnString + 'rock' + ',';
              break;
            case 'consumption_preferences_music_classical':
              returnString = returnString + 'classical' + ',';
              break;
            // case 'consumption_preferences_music_playing':
            //   returnString = returnString + '"r-n-b'
            //   break;
            // case 'consumption_preferences_music_playing':
            //   returnString = returnString + '"r-n-b'
            //   break;
            // case 'consumption_preferences_music_playing':
            //   returnString = returnString + '"r-n-b'
            //   break;
          }
          //returnString = returnString + jsonContent.consumption_preferences[index].consumption_preferences[consindex].consumption_preference_id + ','
        }
      }
    }

  }

  returnString = returnString.slice(0, -1);

  return returnString;

  // if (returnRaw == true) {
  //   return JSON.stringify(jsonContent)
  // } else {
  //   return returnString;
  // }

}
