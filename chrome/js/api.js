// let host = 'http://localhost:8080/api';
let host = 'https://learned.space/api';

let notID = 0;

async function addUrl(tab, userId) {

    // let startTime = new Date();

    let url = host + '/user/link/add?url=' + encodeURIComponent(tab.url) + '&userid=' + userId;

    notification(tab.favIconUrl, tab.title, ''); //TODO

    let request = await get(url);

    // console.log(new Date() - startTime)

    // let text = Math.round(100 * (new Date() - startTime)) / 100 + '';

    let text = request.textLength + ' / ' + request.wordsLength;

    console.log(request)

    console.log(tab)

    notification(tab.favIconUrl, tab.title, text); //TODO
}

function notification(iconUrl, title, text) {

    let options = {
        type : "basic",
        title: title,
        message: text,
        expandedMessage: 'Longer part of the message',
    };

    options.iconUrl = iconUrl;

    // options.priority = 0;

    // options.buttons = [];

//    options.buttons.push({ title: 'ok' });

    let id = 'id' + notID++;

    chrome.notifications.create(id, options, creationCallback);
}

function creationCallback(notID) {

    setTimeout(function () {
        chrome.notifications.clear(notID, function (wasCleared) {
            console.log('Notification ' + notID + ' cleared: ' + wasCleared);
        });
    }, 3000);
}

async function get(url) {
    // console.log(url)
    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    } else {
        console.error(response.toString())
    }
}
