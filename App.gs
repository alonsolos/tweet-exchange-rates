function tuCambista(){
  var response = UrlFetchApp.fetch('https://app.tucambista.pe/api/transaction/getquote/500/USD/BUY/').getContentText();
  responseJson = JSON.parse(response);
  return [responseJson.buyExchangeRate,responseJson.sellExchangeRate];
}

function rextie(){
  var formData = {
    'source_currency': 'PEN',
    'source_amount': '1000',
    'target_currency': 'USD'
  };
  var options = {
    'method' : 'post',
    'payload' : formData
  };
  var response = UrlFetchApp.fetch('https://app.rextie.com/api/v1/fxrates/rate/', options);
  var responseBody = response.getContentText();
  var rextieJSON = JSON.parse(responseBody);
  return [rextieJSON.fx_rate_buy,rextieJSON.fx_rate_sell];
}

function kambista(){
  var response = UrlFetchApp.fetch('https://api.kambista.com/v1/exchange/calculates?originCurrency=USD&destinationCurrency=PEN&amount=1000&active=S').getContentText();
  var kambistaJSON = JSON.parse(response);
  return [kambistaJSON.tc.bid,kambistaJSON.tc.ask];
}

function buildTweetText(rextieCompra,rextieVenta,kambistaCompra,kambistaVenta,tucambistaCompra,tucambistaVenta){
  var checkEmoji = "✅";

  var txtKambistaCompra = "";
  var txtKambistaVenta = "";
  var txtRextieCompra = "";
  var txtRextieVenta = "";
  var txtTuCambistaCompra = "";
  var txtTuCambistaVenta = "";
  
  var maxCompra = Math.max(kambistaCompra,rextieCompra,tucambistaCompra);
  var minVenta = Math.min(kambistaVenta,rextieVenta,tucambistaVenta);
  Logger.log("max min "+ maxCompra + " " + minVenta);
  txtKambistaCompra = "S/"+kambistaCompra;
  txtRextieCompra = "S/"+rextieCompra;
  txtTuCambistaCompra = "S/"+tucambistaCompra;  
  
  if (rextieCompra < maxCompra && tucambistaCompra < maxCompra) {
    txtKambistaCompra += checkEmoji;
    Logger.log("kambista best");
  }
  else if (kambistaCompra < maxCompra && tucambistaCompra < maxCompra) {
    txtRextieCompra += checkEmoji;
    Logger.log("rextie best");
  }
  else if (kambistaCompra < maxCompra && rextieCompra < maxCompra) {
    txtTuCambistaCompra += checkEmoji;
    Logger.log("tucambista best");
  }

  txtKambistaVenta = "S/"+kambistaVenta;
  txtRextieVenta = "S/"+rextieVenta;  
  txtTuCambistaVenta = "S/"+tucambistaVenta;
    
  if (kambistaVenta > minVenta && tucambistaVenta > minVenta) {
    txtRextieVenta += checkEmoji;
  }
  else if (rextieVenta > minVenta && tucambistaVenta > minVenta) {
    txtKambistaVenta += checkEmoji;
  }
  else if (kambistaVenta > minVenta && rextieVenta > minVenta) {
    txtTuCambistaVenta += checkEmoji;
  } 
  
  return "Kambista:\nCompra "+txtKambistaCompra+", Venta "+txtKambistaVenta+"\n\n" +
    "Rextie:\nCompra "+txtRextieCompra+", Venta "+txtRextieVenta+"\n\n" +
    "TuCambista:\nCompra "+txtTuCambistaCompra+", Venta "+txtTuCambistaVenta;
}

/* Main Function */
function postDolar() {
  //REXTIE
  var arrRextie = rextie();
  var rextieCompra = arrRextie[0];
  var rextieVenta = arrRextie[1];
  Logger.log(rextieCompra + " " + rextieVenta);
  //KAMBISTA
  var arrKambista = kambista();
  var kambistaCompra = arrKambista[0];
  var kambistaVenta = arrKambista[1];
  Logger.log(kambistaCompra + " " + kambistaVenta);
  //TUCAMBISTA.PE
  var arrTuCambista = tuCambista();
  var tucambistaCompra = arrTuCambista[0];
  var tucambistaVenta = arrTuCambista[1];
  Logger.log("tucambista.pe: "+tucambistaCompra + " " + tucambistaVenta);
  
  
  sendTweet(buildTweetText(rextieCompra,rextieVenta,kambistaCompra,kambistaVenta,tucambistaCompra,tucambistaVenta));

}
