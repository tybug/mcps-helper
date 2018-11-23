// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
// 	if(changeInfo == "complete"){
// 		console.log("yay")
// 	}
// })

//  chrome.webNavigation.onCompleted.addListener(function() {
//       console.log("background")
//   }, {url: [{urlMatches : 'https://www.google.com/'}]});

// chrome.webNavigation.onCompleted.addListener(function() {
//     console.log("background2");
//     // chrome.tabs.executeScript(null,{file:"contentScript.js"});
//     chrome.tabs.executeScript({file:"lib/jquery-3.3.1.min.js"});
//     chrome.tabs.executeScript({file:"contentScript.js"});
//   }, {url: [{urlMatches : '.*://portal.mcpsmd.org/.*'}]});

// chrome.webNavigation.onHistoryStateUpdated.addListener(function(){
// 	console.log("history updated!")
// })

chrome.tabs.onUpdated.addListener(function(tabId, details, tab){
	if(details.status != "complete" || !tab.url.includes("mcps")){
		return
	}
	chrome.tabs.executeScript({file:"lib/jquery-3.3.1.min.js"});
    chrome.tabs.executeScript({file:"contentScript.js"});
});