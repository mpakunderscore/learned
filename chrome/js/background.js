chrome.browserAction.onClicked.addListener(async function (tab) {

    // chrome.storage.sync.get(['user'], function(result) {
    //     console.log(result);
    // });

    // chrome.tabs.executeScript(tab.id, {code: 'localStorage.getItem("user").id'});

    let userId = 'b7970460-5aa6-11ea-891b-6bbc86b992f4';

    addUrl(tab, userId);
});
