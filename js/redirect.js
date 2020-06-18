/*global chrome,document,window */
(function init(angular) {
    "use strict";
    try {
        chrome.storage.local.get(["url", "tab.selected", "always-tab-update", "delay"], function (items) {
            var url = items.url;
	    var delay = items.delay;
	    if (!delay) {
		delay = 0;
	    }
 	    function sleep(s) {
		var ms = s * 1000
	        return new Promise(resolve => setTimeout(resolve, ms));
	    }
	    async function loadAfterDelay(ms) {
		await sleep(ms);
		if (url) {
                    url = (0 !== url.indexOf("about:") && 0 !== url.indexOf("data:") && -1 === url.indexOf("://")) ? ("http://" + url) : url;
                    if (/^http[s]?:/i.test(url) && items["always-tab-update"] !== true) {
			document.location.href = url;
                    } else {
			chrome.tabs.getCurrent(function (tab) {
                            // a keen user may open the extension's background page and set:
                            // chrome.storage.local.set({'tab.selected': false});
                            var selected = items["tab.selected"] === undefined ? true : (items["tab.selected"] == "true");
                            chrome.tabs.update(tab.id, {
				"url": url,
				"highlighted": selected
                            });
			});
                    }
		} else {
                    angular.resumeBootstrap();
		}
	    }
	    loadAfterDelay(delay)
        });
    } catch(e){
        // If anything goes wrong with the redirection logic, fail to custom apps page.
        console.error(e);
        angular.resumeBootstrap();
    }
})(angular);
