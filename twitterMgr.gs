function isNewTweet(text){
  var userProperties = PropertiesService.getUserProperties();
  var tweet = userProperties.getProperty("last_tweet");
  if (tweet == null || tweet != text) {
    return true;
  }
  return false;
}

function saveLastTweet(text){
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty("last_tweet", text); // Updates stored value.
}

function sendTweet(text){
  var twitterKeys = {
    TWITTER_CONSUMER_KEY: "REPLACE",
    TWITTER_CONSUMER_SECRET: "REPLACE",
    TWITTER_ACCESS_TOKEN: "REPLACE",
    TWITTER_ACCESS_SECRET: "REPLACE",
  }
  
  var props = PropertiesService.getScriptProperties();
  props.setProperties(twitterKeys);
  var params = new Array(0);
  var service = new Twitterlib.OAuth(props);
  
  if (isNewTweet(text) )
  {
    if (!service.hasAccess())
    {
      Logger.log("Authentication Failed");
    } else {
      Logger.log("Authentication Successful");      
      
      try {
        var response = service.sendTweet(text, params);
        saveLastTweet(text);
        Logger.log(response);
      } catch (e) {	Logger.log("error:");Logger.log(e)	}
    }
  }
  else {
    Logger.log("Duplicate tweet, not sending...");
  }
}