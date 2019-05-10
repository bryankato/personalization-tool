var tealium_obj = {};
var pas_obj = {};
var finalResultData = {};
var tealiumBadgeArr =[];

// Polling function
function poll(fn, timeout, interval) {
  var endTime = Number(new Date()) + (timeout || 10000);
  interval = interval || 100;
  var checkCondition = function(resolve, reject) {
    // If the condition is met, we're done!
    var result = fn();
    if(result) {
      resolve(result);
    }
    // If the condition isn't met but the timeout hasn't elapsed, go again
    else if (Number(new Date()) < endTime) {
      setTimeout(checkCondition, interval, resolve, reject);
    }
    // Didn't match and too much time, reject!
    else {
      reject(new Error('timed out for ' + fn + ': ' + arguments));
    }
  };
  return new Promise(checkCondition);
}
// Run array of promises and combine them into an object
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}
// Get data from Tealium localStorage object
function getLocalStorage(inp) {
  console.log("getLocalStorage running");
  return new Promise((resolve, reject) => {
    // Poll for localstorage
    poll(function() {
      // Get Tealium badges
      let tealiumObj = window.localStorage.tealium_va;
      if (typeof tealiumObj !== "undefined") {
        return resolve(JSON.parse(tealiumObj).badges);
      }
    }).then(function() {
      console.log("tealium_va loaded");
      // Polling done
    }).catch(function() {
      // Polling timed out
      console.log("tealium_va timed out")
    });
  });
}
function getPAS(inp) {
  console.log("getPAS running");
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
    if (unknownShopperId.indexOf('|') > -1) {
      unknownShopperId = unknownShopperId.split('|')[0];
    }
    // Create domain for PAS call
    if (lochref.indexOf('www.gap.com') > -1) {
      siteUrl = 'https://www.gap.com/';
    } else if (lochref.indexOf('bananarepublic.gap.com') > -1) {
      siteUrl = 'https://bananarepublic.gap.com/';
    } else if (lochref.indexOf('oldnavy.gap.com') > -1) {
      siteUrl = 'https://oldnavy.gap.com/';
    } else if (lochref.indexOf('athleta.gap.com') > -1) {
      siteUrl = 'https://athleta.gap.com/';
    }
    // Check for DI value
    if (lochref.indexOf('DI=') > -1) {
      hrefArr = lochref.split('DI=');
      if (hrefArr.length > 1) {
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
        if (typeof data.personalizationInfoV1 !== 'undefined' && typeof data.personalizationInfoV1.customerId !=='undefined') {
          finalResultData['ecomid'] = data.personalizationInfoV1.customerId;
        }
        if (typeof data.personalizationInfoV1 !== 'undefined' && typeof data.personalizationInfoV1.customerAttributes !=='undefined') {
          finalResultData['CAData'] = data.personalizationInfoV1.customerAttributes;
        }
        if (typeof data.personalizationInfoV1 !== 'undefined' && data.personalizationInfoV1.featureSelections !== null && typeof data.personalizationInfoV1.featureSelections !== 'undefined' && typeof data.personalizationInfoV1.featureSelections.Evergreens !=='undefined' && data.personalizationInfoV1.featureSelections.Evergreens !==null) {
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

function getDiValue() {
  var pageUrl = window.location.search;
  let urlParams = new URLSearchParams(pageUrl);
  let diValue = urlParams.get("DI");
  return diValue;
}

function createMessage() {
  let message = {
    name:'data',
    diValue:'',
    teal:'',
    pas:'',
    ecomid:'',
    CAData:''
  }
  //for DI value
  var diValue = getDiValue();
  message.diValue = diValue;
  //for ecomid
  if (finalResultData["ecomid"] !== null && typeof finalResultData["ecomid"] !== "undefined" && finalResultData["ecomid"] !== "") {
    message.ecomid = jsonObjectToArray(finalResultData["ecomid"]);
  }
  //for customerAttributes
  if (finalResultData["CAData"] !== null && typeof finalResultData["CAData"] !== "undefined" && finalResultData["CAData"] !== "") {
    var result = Object.entries(finalResultData["CAData"])
    message.CAData = result;
  }
  //for pas
  if (finalResultData["PAS"] !== null && typeof finalResultData["PAS"] !== "undefined" && finalResultData["PAS"] !== "") {
    message.pas = finalResultData["PAS"];
  }
  //for tealium
  if (typeof finalResultData["Tealium"] !== "undefined" && finalResultData["Tealium"] !== "") {
    var tealiumObj = finalResultData['Tealium'];
    tealiumBadgeArr = listAllProperties(tealiumObj);
    if (tealiumBadgeArr.length > 0) {
      message.teal = tealiumBadgeArr;
      chrome.runtime.sendMessage(message);
    }
  }
}
//Function to check if element is json array
function isJsonArray(element) {
  return Object.prototype.toString.call(element).trim() == '[object Array]';
}
//Function to convert json object to json array if it's otherwise it will just return it.
function jsonObjectToArray(element) {
  var jsonArray = [];
  if (!isJsonArray(element) && element !== undefined && element !== "") {
    jsonArray.push(element);
  } else {
    jsonArray = element;
  }
  return jsonArray;
}
//Function to get the badge ids
function listAllProperties(o) {
  var objectToInspect;
  var badgeIds = [];
  for (objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
    badgeIds = badgeIds.concat(Object.keys(objectToInspect));
  }
  return badgeIds;
}

window.addEventListener('load', function() {
  var promiseArr = [getLocalStorage, getPAS, createMessage];
  runPromiseInSequence(promiseArr, tealium_obj).then();
})