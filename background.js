// initialize window
window.customerAttributes='';
window.diValue ='';
window.ecomid='';
window.optly='';
window.pas ='';
window.teal = '';

// Pass data to content script
chrome.runtime.onMessage.addListener(fromContentScript);

function fromContentScript(req, sender, sendResponse){
  console.log("fromContentScript running");
  window.customerAttributes = req.CAData;
  window.diValue = req.diValue;
  window.ecomid = req.ecomid;
  window.pas = req.pas;
  window.teal = req.teal;
  console.log('Tealium : ' + teal);
  console.log('PAS : ' + pas);
}

// Get Optmizely network call
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