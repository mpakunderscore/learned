function initInput() {

    let input = document.getElementById('main-input');
    input.id = 'main-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Link input, search or message';
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
        '<div>Last update: 29.02.2020</div>' +
        '<div>Version: 0.3.2</div>' +
        '<div>Design update, small</div>' +
        '<div class="info">Personal graph from mine links, alpha 2</div>' +
        '<div>Go colors</div>' +
        // '<div class="info">Link input work not properly</div>' +
        // '<div>Explore graph and <strike>interesting</strike> links</div>' +
        // '<div>Click on active node name to remove edges</div>' +
        // '<div>Click on link to save it in mine</div>' +
        // '<div>Move border</div>' +
        '';

    // TODO card design
    contentList.innerHTML += renderCard('インタラクションカードの例', 'セゴビアはマドリードからの日帰り観光地として人気がある（マドリードからは高速鉄道で30分）。旧市街は長く狭い高台の上に壮大に位置している。大聖堂、古代ローマの水道橋、美しいおとぎ話にでてきそうな古城（アルカサル）などの名所があり、眼下には田舎の景色が広がっている。カスティーリャと言われるこの辺りの景色は赤い大地という異名と合わせてファンタジーではよく用いられる。')
}

// TODO need refactoring

function setContent(pages, mainPage, categoriesLength, title) {

    // console.log(responseJson)

    // let categories = responseJson.categories

    // console.log(mainPage)

    // initInput();

    let html = '';

    // if (mainPage.image) {
    //     html += '<div id="main-image"><img src="' + mainPage.image + '" alt="Page name"/></div>';
    // }


    html += renderCard(title, mainPage.text)

    html += renderHelpRow(pages.length, categoriesLength);

    for (let i = 0; i < pages.length; i++) {
        html += '<div><a onclick="linkClick(this.href)" href="https://' + lang + '.wikipedia.org/wiki/' + pages[i].id.replace(/\s/g, '_') + '" target="_blank">' + pages[i].id + '</a></div>';
    }
    contentList.innerHTML = html;
}

function renderHelpRow(pagesLength, categoriesLength) {
    return '' +
        '<div class="help-row">' +
        '<div>Sort: name / time / complexity</div>' +
        '<div>Pages: ' + pagesLength + ', Categories: ' + categoriesLength + '</div>' +
        '</div>';
}

function renderCard(title, text, img) {
    return '' +
    '<div class="card" onclick="this.style.display = \'none\'">' +
        '<div class="title">' +
            '<div class="circle"></div>' +
            '<div class="title-text">' + title + '</div>' +
        '</div>' +
        (text ? '<div class="text">' + text + '</div>' : '') +
    '</div>';
}

function renderUserLinks() {

    // console.log(responseJson)

    // let categories = responseJson.categories

    // console.log(categories)

    // initInput();

    let html = '';
    html += '<div id="main-text">Your links collection</div>';
    // html += '<div>Links: ' + user.links.length +'</div>';
    for (let i = 0; i < user.links.length; i++) {
        html += '<div class="link"><a href="' + user.links[i].url + '" target="_blank">' + user.links[i].url + '</a></div>';
    }
    contentList.innerHTML = html;
}

function clickMainCircle() {

    contentList.innerHTML += '<div id="message"></div>';

    let message = document.getElementById('message')

    // let iterator = 0;
    // let dotCount = 1;
    let i = 0;
    let text = 'You cannot return to where there is nothing'

    let interval = setInterval(function () {

        // message.innerText = '.'.repeat(dotCount++)

        // if (dotCount >= 4)
        //     dotCount = 1;

        message.innerText = generatedWord(text, i);

        i++;

        if (i > text.length)
            clearInterval(interval)

        // console.log(i)

    }, 30);
}

function generatedWord(text, i) {
    return text.substring(0, i);
}

let linkClick = (url) => {
    // console.log(url)
    const response = get('/user/link/add?userid=' + user.id + '&url=' + url);
    console.log(JSON.parse(response));
}
