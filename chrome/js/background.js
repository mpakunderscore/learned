chrome.browserAction.onClicked.addListener(function(tab) {

    localStorage["userid"] = 0;

    var userId = localStorage["userid"];
    if (!userId) {

        var url = host + "/user";

        var request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send(null);

        var response = request.responseText;

        if (response.length == 0) {

            // var loginURL = host + "/login";
            // chrome.tabs.create({ url: loginURL });
            // return;
        }

        var user = JSON.parse(response);

        userId = user.id;
        localStorage["userid"] = userId;
    }

    add_url(tab, userId);
});
