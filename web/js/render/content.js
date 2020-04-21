

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
        '<div><span onclick="showPages()">Pages: ' + pagesLength + '</span>, <span onclick="showCategories()">Categories: ' + categoriesLength + '</span></div>' +
        '</div>';
}

function showPages() {

}

function showCategories() {

}
