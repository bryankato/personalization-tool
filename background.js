console.log('running background');
/*chrome.runtime.onMessage.addListener(function (msg, sender) {
  console.log(msg);
  // First, validate the message's structure
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab
    chrome.pageAction.show(sender.tab.id);
  }
});*/

//New thing
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

chrome.webRequest.onSendHeaders.addListener(function (details) {
  const urlParams = new URLSearchParams(details.url);
  const myParams = urlParams.get("l1");
  const myParamsArr = myParams.split(",");
  window.optly = myParamsArr;
  // split myParams into expiriment names
  // pass to window obj
}, {urls : ["*://securemetrics.gap.com/*"]});

// chrome.browserAction.disable(tabId)