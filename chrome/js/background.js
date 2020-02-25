chrome.browserAction.onClicked.addListener(async function (tab) {

    console.log('Click')

    const key = 'user'

    // const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    // const tab = tabs[0];

    // const fromPageLocalStore = await chrome.tabs.executeScript(tab.id, {code: `localStorage['${key}']`});

    // console.log(fromPageLocalStore)

    let userId = '6827d290-5689-11ea-8832-ade19f30daa6';

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
