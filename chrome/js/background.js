let auth = false;
let userId = '';

function receiveText(resultsArray) {

    userId = JSON.parse(resultsArray).id;
    auth = true;
    setIcon();

    // chrome.tabs.getCurrent(function (tab) {
    //     chrome.tabs.remove(tab.id, function () {});
    // });
}

chrome.browserAction.onClicked.addListener(async function (tab) {

    if (!auth) {

        if (tab.url.startsWith('https://learned.space')) {
            getLocalStorageUser(tab)

        } else
            chrome.tabs.create({url: 'https://learned.space'}, function (tab) {
                getLocalStorageUser(tab)
            });

    } else
        try {
            await addUrl(tab, userId);
        } catch (e) {
        }
});

function getLocalStorageUser(tab) {
    chrome.tabs.executeScript(tab.id, {code: 'localStorage.getItem("user")'}, receiveText);
}

function setIcon() {
    chrome.browserAction.setIcon({
        path: './icons/icon.png',
    });
}
