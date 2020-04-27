let pages = [];
let mainPage = '';
let categories = [];
let title = '';

function setContent(renderPages = true, title = this.title, mainPage = this.mainPage, pages = this.pages, categories = this.categories) {

    this.title = title;
    this.mainPage = mainPage;
    this.pages = pages;
    this.categories = categories;

    clearContent();
    renderCard(title, mainPage.text)

    let html = renderHelpRow(pages.length, categories.length);

    if (renderPages)
        for (let i = 0; i < pages.length; i++) {
            html += '<div><a onclick="linkClick(this.href)" href="https://' + lang + '.wikipedia.org/wiki/' + pages[i].id.replace(/\s/g, '_') + '" target="_blank">' + pages[i].id + '</a></div>';
        }

    else
        for (let i = 0; i < categories.length; i++) {
            html += '<div><a onclick="linkClick(this.href)" href="https://' + lang + '.wikipedia.org/wiki/Category:' + categories[i].id.replace(/\s/g, '_') + '" target="_blank">' + categories[i].id + '</a></div>';
        }

    contentList.innerHTML += html;
}


function clearContent() {
    contentList.innerHTML = '';
}

function renderHelpRow(pagesLength, categoriesLength) {
    return '' +
        '<div class="help-row">' +
        '<div><span class="text">sort:</span>' +
        '<span class="button" onclick="renderMine(true, this.filter, \'title\')">name</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'textLength\')">length</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'wordsLength\')">words</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'url\')">source</span></div>' +
        '<div><span onclick="showPages()" class="button">Pages: ' + pagesLength + '</span>/<span onclick="showCategories()" class="button">Categories: ' + categoriesLength + '</span></div>' +
        '</div>';
}

function showPages() {
    setContent()
}

function showCategories() {
    setContent(false)
}

function setText(text, className) {
    let contentTextRow = document.createElement('div');
    // contentTextRow.classList.add('message')
    contentList.append(contentTextRow)

    if (className)
        contentTextRow.classList.add(className)

    contentTextRow.innerHTML = text;
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

function goBack() {
    clickHome();
    setPath('/');
    document.getElementById('content-head').classList.add('active');

}
