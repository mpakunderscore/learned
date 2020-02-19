function initInput() {
    return '<input id="input" autocomplete="off" placeholder="Link, message or search"/>';
}

function initChat() {
    return '<div class="info">Link input does not work currently</div>' +
        '<div>Last update: 18.02.2020</div>' +
        '<div>Explore graph and <strike>interesting</strike> links</div>' +
        '<div>Click on active node name to remove edges</div>' +
        '<div>Click on link to save it in mine</div>' +
        '<div>Move border</div>';

}

function setContent(pages, mainPage, categoriesLength) {

    // console.log(responseJson)

    // let categories = responseJson.categories

    // console.log(categories)

    content.innerHTML = initInput();

    let html = '';
    if (mainPage.text) {
        html += '<div id="main-text">' + mainPage.text + '</div>';
    }
    html += '<div>Pages: ' + pages.length + ', Categories: ' + categoriesLength + '</div>';
    for (let i = 0; i < pages.length; i++) {
        html += '<div><a onclick="linkClick(this.href)" href="https://' + lang + '.wikipedia.org/wiki/' + pages[i].id.replace(/\s/g, '_') + '" target="_blank">' + pages[i].id + '</a></div>';
    }
    content.innerHTML += html;
}

function setMine() {

    // console.log(responseJson)

    // let categories = responseJson.categories

    // console.log(categories)

    content.innerHTML = initInput();

    let html = '';
    html += '<div id="main-text">Your links collection</div>';
    // html += '<div>Links: ' + user.links.length +'</div>';
    for (let i = 0; i < user.links.length; i++) {
        html += '<div><a href="' + user.links[i].url + '" target="_blank">' + user.links[i].url + '</a></div>';
    }
    content.innerHTML += html;
}

let linkClick = (url) => {
    console.log(url)
    const response = get('/link?userid=' + user.id + '&url=' + url);
    // console.log(JSON.parse(response));
}
