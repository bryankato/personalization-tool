//window.onload(function(){
var tealium_obj = {};
var pas_obj = {};
var finalResultData = {};
var tealiumBadgeArr =[];

function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}
function p1(inp) {
   return new Promise((resolve, reject) => {
     // return resolve(JSON.parse(window.localStorage.tealium_va));
     return resolve(JSON.parse(window.localStorage.tealium_va).badges);
  });
}
function p2(inp) {
  return new Promise((resolve, reject) => {
    finalResultData['Tealium'] = inp;
      // cookie
      function getCookieValue(a) {
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
      }
      //unknownShopperId
      var unknownShopperId = getCookieValue('unknownShopperId');
      var lochref = location.href;
      var hrefArr =[];
      var siteUrl = '';
      var forceDI = [];
      var newurl ='';
      if(unknownShopperId.indexOf('|') > -1){
        unknownShopperId = unknownShopperId.split('|')[0];
      }
      // Create domain for PAS call
      if(lochref.indexOf('www.gap.com') > -1){
        siteUrl = 'https://www.gap.com/';
      } else if(lochref.indexOf('bananarepublic.gap.com') > -1){
        siteUrl = 'https://bananarepublic.gap.com/';
      } else if(lochref.indexOf('oldnavy.gap.com') > -1){
        siteUrl = 'https://oldnavy.gap.com/';
      } else if(lochref.indexOf('athleta.gap.com') > -1){
        siteUrl = 'https://athleta.gap.com/';
      }
      // Check for DI value
      if(lochref.indexOf('DI=') > -1){
        hrefArr = lochref.split('DI=');
        if(hrefArr.length > 1){
          forceDI = hrefArr[1].split('&');
          newurl = siteUrl+'resources/personalization/v1/'+unknownShopperId+'?originPath=/&mdsId='+forceDI[0]+'&referrer=';
        }
      } else {
        var newurl = siteUrl+'resources/personalization/v1/'+unknownShopperId+'?originPath=/';
      }
      // PAS call
      var request = new XMLHttpRequest();
      request.open('GET', newurl, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          console.log(data);
          if(typeof data.personalizationInfoV1 !== 'undefined' && typeof data.personalizationInfoV1.customerId !=='undefined'){
            finalResultData['ecomid'] = data.personalizationInfoV1.customerId;
          }
          if(typeof data.personalizationInfoV1 !== 'undefined' && typeof data.personalizationInfoV1.customerAttributes !=='undefined'){
            finalResultData['CAData'] = data.personalizationInfoV1.customerAttributes;
          }
          if(typeof data.personalizationInfoV1 !== 'undefined' && data.personalizationInfoV1.featureSelections !== null && typeof data.personalizationInfoV1.featureSelections !== 'undefined' && typeof data.personalizationInfoV1.featureSelections.Evergreens !=='undefined' && data.personalizationInfoV1.featureSelections.Evergreens !==null){
            var pasObj = data.personalizationInfoV1.featureSelections.Evergreens;
            finalResultData['PAS'] = pasObj;
            return resolve(request);
          }
          else {
          finalResultData['PAS'] = '';
          return resolve(request);
        }
      }
    };
    // If request fails
    request.onerror = function() {
      console.log('data2');
    };
    // Send request
    request.send();
  });
}
function f1(){
  let message = {
    teal:'',
    pas:'',
    ecomid:'',
    CAData:''
  }
  //for ecomid
  if(finalResultData["ecomid"] !== null && typeof finalResultData["ecomid"] !== "undefined" && finalResultData["ecomid"] !== ""){
    message.ecomid = jsonObjectToArray(finalResultData["ecomid"]);
  }
  //for customerAttributes
  if(finalResultData["CAData"] !== null && typeof finalResultData["CAData"] !== "undefined" && finalResultData["CAData"] !== ""){
    var result = Object.entries(finalResultData["CAData"])
    message.CAData = result;
  }
  //for pas
  if(finalResultData["PAS"] !== null && typeof finalResultData["PAS"] !== "undefined" && finalResultData["PAS"] !== ""){
    console.log('finalResultData["PAS"]');
    console.log(finalResultData["PAS"]);
    message.pas = finalResultData["PAS"];
  }
  //for tealium
  if(typeof finalResultData["Tealium"] !== "undefined" && finalResultData["Tealium"] !== ""){
    //if (typeof finalResultData['Tealium'].badges !== "undefined" ){
      var tealiumObj = finalResultData['Tealium'];
      tealiumBadgeArr = listAllProperties(tealiumObj);
      console.log('finalResultData["teal"]');
      console.log(tealiumBadgeArr);
      if(tealiumBadgeArr.length > 0){
        message.teal = tealiumBadgeArr;
        chrome.runtime.sendMessage(message);
      }
    //}
  }
}
//Function to check if element is json array
function isJsonArray(element) {
  return Object.prototype.toString.call(element).trim() == '[object Array]';
}
//Function to convert json object to json array if it's otherwise it will just return it.
function jsonObjectToArray(element){
  var jsonArray = [];
  if(!isJsonArray(element) && element !== undefined && element !== ""){
    jsonArray.push(element);
  }else {
    jsonArray = element;
  }
  return jsonArray;
}
//Function to get the badge ids
function listAllProperties(o) {
  var objectToInspect;
  var badgeIds = [];
  for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
      badgeIds = badgeIds.concat(Object.keys(objectToInspect));
  }
  return badgeIds;
}

//new way

window.addEventListener('load', function() {
  var promiseArr = [p1, p2, f1];
  //setTimeout(function(){
    runPromiseInSequence(promiseArr, tealium_obj).then();
  //},5000);
})