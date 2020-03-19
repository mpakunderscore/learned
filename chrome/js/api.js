let host = "http://localhost:8080/api";

let notID = 0;

async function addUrl(tab, userId) {

    let secondsStart = new Date().getTime() / 1000;

    let url = host + "/user/link/add?url=" + encodeURIComponent(tab.url) + "&userid=" + userId;

    let request = await get(url);

    let secondsEnd = new Date().getTime() / 1000;

    let time = (secondsEnd - secondsStart) + "";

    notification(tab.favIconUrl, tab.title, time); //TODO
}

function notification(iconUrl, title, text) {

    let options = {
        type : "basic",
        title: title,
        message: text,
        expandedMessage: "Longer part of the message"
    };

    options.iconUrl = iconUrl;

    options.priority = 0;

    options.buttons = [];

//    options.buttons.push({ title: "ok" });

    let id = "id" + notID++;

    chrome.notifications.create(id, options, creationCallback);
}

function creationCallback(notID) {

    // console.log("Succesfully created " + notID + " notification");

//    if (document.getElementById("clear").checked) {

        // setTimeout(function() {
        //
        //     chrome.notifications.clear(notID, function(wasCleared) {
        //         console.log("Notification " + notID + " cleared: " + wasCleared);
        //     });
        //
        // }, notificationTime);
//    }
}

async function get(url) {
    // console.log(url)
    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        console.error(response)
    }
}
