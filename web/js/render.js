function initInput() {
    return '<input id="input" autocomplete="off" placeholder="Link, message or search"/>';
}

function initChat() {
    return '<div class="info">Link input does not work currently</div>' +
        '<div>Explore graph</div>' +
        '<div>Click on active node name to remove edges</div>' +
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

let linkClick = (url) => {
    console.log(url)
}
