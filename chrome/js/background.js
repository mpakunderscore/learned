document.addEventListener('DOMContentLoaded', async () => {
    try {
        const key = "user"

        // Get the current tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];

        // Execute script in the current tab
        const fromPageLocalStore = await chrome.tabs.executeScript(tab.id, { code: `localStorage['${key}']` });

        console.log(fromPageLocalStore)

        // Store the result
        // await chrome.storage.local.set({[key]:fromPageLocalStore[0]});
    }
    catch(err) {
        // Log exceptions
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.method == "getStatus")
        sendResponse({status: localStorage['user']});
    else
        sendResponse({}); // snub them.
});

let auth = false;
let userId = '';

chrome.browserAction.onClicked.addListener(async function (tab) {

    chrome.runtime.sendMessage({method: "getStatus"}, function(response) {
        console.log(response);
    });


    // chrome.browserAction.setIcon({path: {
    //         '19': 'icons/red.png',
    //         '38': 'icons/red.png',
    //         '128': 'icons/red.png'
    //     }});

    // chrome.storage.sync.get(['user'], function(result) {
    //     console.log(result);
    // });

    // chrome.tabs.getCurrent(function(tab) {
    //     chrome.tabs.sendRequest(tab.id, {method: 'getlocalStorage'}, function(response) {
    //     });
    // })

    // chrome.tabs.executeScript(tab.id, {code: 'localStorage.getItem('user').id'});

    // chrome.storage.local.get(['user'], function (result) {
    //     console.log(result);
    // });
    //
    // chrome.storage.sync.get(['user'], function (result) {
    //     console.log(result);
    // });

    if (!auth) {

        let newURL = 'https://learned.space';
        chrome.tabs.create({url: newURL});

        userId = 'b7970460-5aa6-11ea-891b-6bbc86b992f4';
        auth = true;

        // notification('', 'Login', userId); //TODO
    }


    // let userId = 'b7970460-5aa6-11ea-891b-6bbc86b992f4';

    try {
        await addUrl(tab, userId);
    } catch (e) {
    }
});

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         // read `newIconPath` from request and read `tab.id` from sender
//         chrome.browserAction.setIcon({
//             path: request.newIconPath,
//             tabId: sender.tab.id
//         });
//     });
