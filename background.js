// initialize window
window.customerAttributes='';
window.diValue ='';
window.ecomid='';
window.optly='';
window.pas ='';
window.tabId = '';
window.teal = '';

// Get Optmizely call
chrome.webRequest.onSendHeaders.addListener(function (details) {
  const urlParams = new URLSearchParams(details.url);
  // Get l1 query parameter
  const myParams = urlParams.get("l1");
  if (myParams != "") {
    // Split comma delimited string to get campaigns
    const myParamsArr = myParams.split(",");
    // Pass array of campaigns to window
    window.optly = myParamsArr;
  }
}, {urls : ["*://securemetrics.gap.com/*"]});

function getContentScriptData(req, sender, sendResponse){
  // Assign data to tabId keyed object
  window.customerAttributes = req.CAData;
  window.diValue = req.diValue;
  window.ecomid = req.ecomid;
  window.pas = req.pas;
  window.teal = req.teal;
  console.log('Tealium : ' + window.teal);
  console.log('PAS : ' + window.pas);
  console.log('Optmizely : ' + window.optly);
}

// Get data from content script
chrome.runtime.onMessage.addListener(getContentScriptData);