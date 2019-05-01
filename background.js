// Pass data to content script
window.teal = ''; window.pas =''; window.ecomid=''; window.customerAttributes=''; window.optly='';
chrome.runtime.onMessage.addListener(fromcontentscrpt);
function fromcontentscrpt(req, sender, sendResponse){
  window.teal = req.teal;
  window.pas = req.pas;
  window.ecomid = req.ecomid;
  window.customerAttributes = req.CAData;
  console.log('teal'+teal);
  console.log('pas'+pas);
}

// Get Optmizely network call
chrome.webRequest.onSendHeaders.addListener(function (details) {
  const urlParams = new URLSearchParams(details.url);
  // Get l1 query parameter
  const myParams = urlParams.get("l1");
  // Split comma delimited string to get campaigns
  const myParamsArr = myParams.split(",");
  // Pass array of campaigns to window
  window.optly = myParamsArr;
}, {urls : ["*://securemetrics.gap.com/*"]});

