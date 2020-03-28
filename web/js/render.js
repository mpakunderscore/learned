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
                linkClick(value).then(() => {
                    renderMine(false).then()
                })
        }
    });
}

// TODO need refactoring

function setContent(pages, mainPage, categoriesLength, title) {

    let html = '';
    contentList.innerHTML = '';

    // if (mainPage.image) {
    //     html += '<div id="main-image"><img src="' + mainPage.image + '" alt="Page name"/></div>';
    // }

    renderCard(title, mainPage.text)

    html += renderHelpRow(pages.length, categoriesLength);

    for (let i = 0; i < pages.length; i++) {
        html += '<div><a onclick="linkClick(this.href)" href="https://' + lang + '.wikipedia.org/wiki/' + pages[i].id.replace(/\s/g, '_') + '" target="_blank">' + pages[i].id + '</a></div>';
    }
    contentList.innerHTML += html;
}

function renderHelpRow(pagesLength, categoriesLength) {
    return '' +
        '<div class="help-row">' +
        '<div>Sort: name / time / complexity</div>' +
        '<div>Pages: ' + pagesLength + ', Categories: ' + categoriesLength + '</div>' +
        '</div>';
}

function renderCard(title, text, img, color = 'green') {

    contentList.innerHTML +=
    '<div class="card" onclick="isMobile ? fullscreen() : this.style.display = \'none\'">' +
        '<div class="title">' +
            '<div class="circle ' + color +'"></div>' +
            '<div class="title-text">' + title + '</div>' +
        '</div>' +
        (text ? '<div class="text">' + text + '</div>' : '') +
    '</div>';
}

// function renderLinkGraph() {
//     console.log('renderLinkGraph')
// }

let filter = false;
let sorter;

async function renderMine(lazy, filter = this.filter, sorter = this.sorter) {

    this.filter = filter;
    this.sorter = sorter;

    if (!lazy)
        getUserLinks().then(() => renderMine(true));

    let html = '';

    html += '<div id="main-text">Sort:' +
        '<span class="button" onclick="renderMine(true, this.filter, \'title\')">title</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'textLength\')">time</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'wordsLength\')">complexity</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'url\')">source</span></div>';

    html += '<div id="main-text">Filter:' +
        '<span class="button" onclick="renderMine(true, true)">big</span>/' +
        '<span class="button" onclick="renderMine(true, false)">all</span></div>';

    for (let i = 0; i < 1; i++) {
        html += '' +
            '<div class="link recommended">' +
            '<a href="">Recommended link</a>' +
            '</div>';
    }

    let links;
    try {

        links = user.links.filter(link => filter ? link.wordsLength > 1000 : true);
        if (sorter)
            links.sort((a, b) => (a[sorter] > b[sorter]) ? -1 : 1);
    } catch (e) {
    }

    if (links)
        for (let i = 0; i < links.length; i++) {

            let url = links[i].url;
            html += '' +
                '<div class="link">' +
                '<a href="' + url + '" target="_blank" title="' + url + '">' +
                links[i].title +
                '</a>' +
                '<span title="Link graph" onclick="crawlMineLink(this)">G</span>' +
                '<span title="Delete link" onclick="deleteLink(this)">✕</span>' +
                '<span>' + links[i].textLength + '</span>' +
                '<span>/</span>' +
                '<span>' + links[i].wordsLength + '</span>' +
                '</div>';
        }

    contentList.innerHTML = html;
}

function clickHome() {
    initServiceInfo();
    renderText('You are back now')
}

function setText(text, status) {
    let message = document.createElement('div');
    contentList.append(message)
    if (status)
        message.classList.add(status)
    message.innerHTML = text;
}

function renderText(text, next) {

    console.log(text)
    // const timeout = 30;
    const timeout = 0;

    // return;

    let message = document.createElement('div');
    contentList.append(message)

    // let iterator = 0;
    // let dotCount = 1;
    let i = 0;
    // let text = text

    let interval = setInterval(function () {

        // message.innerText = '.'.repeat(dotCount++)

        // if (dotCount >= 4)
        //     dotCount = 1;

        message.innerHTML = generatedWord(text, i);

        i++;

        if (i > text.length) {
            clearInterval(interval)
            next()
        }


        // console.log(i)

    }, timeout);
}

function generatedWord(text, i) {
    return text.substring(0, i);
}

function addLink (url, title) {
    let link = document.createElement('div');
    contentList.append(link)

    let a = document.createElement('a');
    a.href = url;
    a.innerText = title;
    a.target = '_blank';
    link.append(a);


    // link.innerText = title;
}
