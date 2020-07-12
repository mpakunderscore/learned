async function renderMine(lazy, filter = this.filter, sorter = this.sorter) {

    headerActive(false)

    this.filter = filter;
    this.sorter = sorter;

    if (!lazy)
        getUserLinks().then(() => renderMine(true));

    let html = '';

    // html += '<div><span class="button simple" onclick="selectMain()">Back to main page</span></div>';

    html += '<div><span class="text">Sort:</span>' +
        '<span class="button" onclick="renderMine(true, this.filter, \'title\')">name</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'textLength\')">length</span>/' +
        // '<span class="button" onclick="renderMine(true, this.filter, \'wordsLength\')">words</span>/' +
        '<span class="button" onclick="renderMine(true, this.filter, \'url\')">source</span></div>';

    html += '<div id=""><span class="text">Difficulty:</span>' +
        '<span class="button" onclick="renderMine(true, true)">hard</span>/' +
        // '<span class="button" onclick="renderMine(true, true)">normal</span>/' +
        '<span class="button" onclick="renderMine(true, false)">easy</span></div>';

    for (let i = 0; i < 1; i++) {
        html += '' +
            '<div class="link recommended">' +
                '<a href="/recommended" target="_blank" title="Recommended">Recommended link</a>' +
                '<div><span title="Link graph" onclick="crawlMineLink(this)" class="button">G</span>' +
                '<span class="button">' + 0 + '</span>' +
                '<span class="button">' + 0 + '</span>' +
                '<span title="Delete link" onclick="deleteLink(this)" class="button">✕</span></div>' +
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
        for (let i = links.length - 1; i >= 0; i--) {

            let url = links[i].url;
            html += '' +
                '<div class="link">' +
                    '<a href="' + url + '" target="_blank" title="' + url + '">' + (links[i].title ? links[i].title : links[i].url) + '</a>' +
                    '<div><span title="Link graph" onclick="crawlMineLink(this)" class="button">G</span>' +
                    '<span class="button">' + Math.round(links[i].textLength/1000) + '</span>' +
                    '<span class="button">' + Math.round(links[i].wordsLength/1000) + '</span>' +
                    '<span title="Delete link" onclick="deleteLink(this)"class="button">✕</span></div>' +
                '</div>';

        }

    contentList.innerHTML = html;
}
