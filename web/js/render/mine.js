
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

                '<span>' + links[i].textLength + '</span>' +
                '<span>/</span>' +
                '<span>' + links[i].wordsLength + '</span>' +
                '<span title="Delete link" onclick="deleteLink(this)">✕</span>' +
                '</div>';

        }

    contentList.innerHTML = html;
}
