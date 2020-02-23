function initInput() {

    let input = document.getElementById('main-input');
    input.id = 'main-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Link, message or search';
    // content.innerHTML = '<input id="main-input" autocomplete="off" placeholder="Link, message or search"/>';
    // let input = document.getElementById('main-input');

    // console.log(input)
    // input.value = 'test';

    content.append(input)

    input.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            let value = input.value;
            // console.log(value)
            input.value = '';

            if (value.startsWith('http'))
                linkClick(value)
        }
    });
}

function initServiceInfo() {

    contentList.innerHTML = '' +
        '<div>Last update: 20.02.2020</div>' +
        '<div>Version: 0.2.2</div>' +
        '<div class="info">Link input does not work properly\n</div>' +
        '<div>Explore graph and <strike>interesting</strike> links</div>' +
        '<div>Click on active node name to remove edges</div>' +
        '<div>Click on link to save it in mine</div>' +
        '<div>Move border</div>' +
        '';
}

function setContent(pages, mainPage, categoriesLength) {

    // console.log(responseJson)

    // let categories = responseJson.categories

    console.log(mainPage)

    // initInput();

    let html = '';

    if (mainPage.image) {
        html += '<div id="main-image"><img src="' + mainPage.image + '" alt="Page name"/></div>';
    }

    if (mainPage.text) {
        html += '<div id="main-text">' + mainPage.text + '</div>';
    }
    html += '<div>Pages: ' + pages.length + ', Categories: ' + categoriesLength + '</div>';
    for (let i = 0; i < pages.length; i++) {
        html += '<div><a onclick="linkClick(this.href)" href="https://' + lang + '.wikipedia.org/wiki/' + pages[i].id.replace(/\s/g, '_') + '" target="_blank">' + pages[i].id + '</a></div>';
    }
    contentList.innerHTML = html;
}

function setMine() {

    // console.log(responseJson)

    // let categories = responseJson.categories

    // console.log(categories)

    // initInput();

    getUserLinks();

    let html = '';
    html += '<div id="main-text">Your links collection</div>';
    // html += '<div>Links: ' + user.links.length +'</div>';
    for (let i = 0; i < user.links.length; i++) {
        html += '<div><a href="' + user.links[i].url + '" target="_blank">' + user.links[i].url + '</a></div>';
    }
    contentList.innerHTML = html;
}

function setCircle() {
    contentList.innerHTML += '<div id="message"></div>';
    let message = document.getElementById('message')

    let dotIteration = 0;
    let dotCount = 1;
    let dotInterval = setInterval(function () {
        message.innerText = '.'.repeat(dotCount++)
        if (dotCount >= 4)
            dotCount = 1;
        if (dotIteration++ > 8) {
            clearInterval(dotInterval);
            message.innerText = 'What'
        }
    }, 300);
}

let linkClick = (url) => {
    // console.log(url)
    const response = get('/user/link/add?userid=' + user.id + '&url=' + url);
    console.log(JSON.parse(response));
}
