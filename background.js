chrome.tabs.onUpdated.addListener(function(tabId, details, tab){
	if(details.status != "complete" || !tab.url.includes("portal.mcpsmd.org")){
		return
	}
	chrome.pageAction.show(tabId);
	chrome.tabs.executeScript(tabId, {file:"lib/jquery-3.3.1.min.js"});
	chrome.tabs.executeScript(tabId, {file:"contentScript.js"});
});
