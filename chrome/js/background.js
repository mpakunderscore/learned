chrome.browserAction.onClicked.addListener(async function (tab) {

    console.log('Click')

    const key = 'user'

    // const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    // const tab = tabs[0];

    // const fromPageLocalStore = await chrome.tabs.executeScript(tab.id, {code: `localStorage['${key}']`});

    // console.log(fromPageLocalStore)

    let userId = '95aa5a50-5f60-11ea-b80a-d1db10638b99';

    // var userId = localStorage["userid"];
    // if (!userId) {
    //
    //     var url = host + "/user";
    //
    //     var request = new XMLHttpRequest();
    //     request.open("GET", url, false);
    //     request.send(null);
    //
    //     var response = request.responseText;
    //
    //     if (response.length == 0) {
    //
    //         // var loginURL = host + "/login";
    //         // chrome.tabs.create({ url: loginURL });
    //         // return;
    //     }
    //
    //     var user = JSON.parse(response);
    //
    //     userId = user.id;
    //     localStorage["userid"] = userId;
    // }

    add_url(tab, userId);
});
