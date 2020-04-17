let auth = false;
let userId = '';

function receiveText(resultsArray) {
    userId = JSON.parse(resultsArray).id;
    auth  = true;
    chrome.browserAction.setIcon('');
}

chrome.browserAction.onClicked.addListener(async function (tab) {

    if (!auth) {
        chrome.tabs.create({url: 'https://learned.space'}, function(tab) {
            chrome.tabs.executeScript(tab.id, {
                code: 'localStorage.getItem("user")'
            }, receiveText);
        });
    } else {
        try {
            await addUrl(tab, userId);
        } catch (e) {}
    }

    // notification('', 'Login', userId); //TODO
});
