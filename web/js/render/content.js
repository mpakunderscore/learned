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
        '<div>Sort: name / time / complexity</div>' +
        '<div><span onclick="showPages()" class="button">Pages: ' + pagesLength + '</span>/<span onclick="showCategories()" class="button">Categories: ' + categoriesLength + '</span></div>' +
        '</div>';
}

function showPages() {
    setContent()
}

function showCategories() {
    setContent(false)
}
