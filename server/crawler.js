const database = require('./database');

const cheerio = require('cheerio');
const axios = require('axios');

// let globalWords = {
//     the: {
//         used: true,
//     }
// };

// so, here we need the full words (?) of wiki word pages?
// after it..

// words fill categories for 100%

// если парсить все слова - это 5к запросов на первые документы. и лучше сразу писать в базу через фильтр
// причем писать сразу в графовую. и получается 2 графа. один это категории, второй это токены слов


// exports.getURLsData = async function (urls) {
//
//     let pages = [];
//     urls.forEach(async url => {
//         pages.push(await getURLData(url))
//     });
//
//     pages.forEach(async page => {
//         setGraph(page)
//     });
//
//     return pages;
// };
//
// let setGraph = function (page) {
//
//     page.tfidf = {};
//
//     page.words.forEach(word => {
//         page.tfidf[word] = word / globalWords[word];
//     });
// };

exports.crawlURLLinks = async function (url) {

    let subPages = [];
    let page = await exports.getURLData(url);

    // async page.internalLinks.forEach(link => {
    //     subPages.push(await exports.getURLData(link));
    // })

    for (const link of page.internalLinks) {
        subPages.push(await exports.getURLData(link));
    }

    return subPages;
};

exports.getURLData = async function (url) {

    console.log('getURLData: ' + url);

    let databaseLink = await database.getLink(url);
    if (databaseLink)
        return databaseLink;

    const urlArray = url.split( '/' );

    const protocol = urlArray[0];
    const host = urlArray[2];
    const baseUrl = protocol + '//' + host;

    try {
        const response = await axios.get(encodeURI(url));
        const data = response.data;

        // console.log(data);

        const $ = cheerio.load(data);

        const title = $('title').text();
        const text = $.root().text().toLowerCase().replace(/\n/g, '');
        let internalLinks = [];
        let externalLinks = [];
        $('a').each(function (i, link) {

            let linkUrl = $(link).attr('href');

            if (linkUrl) {
                if (linkUrl.includes('http'))
                    externalLinks.push(linkUrl);
                else {
                    internalLinks.push(baseUrl + '/' + linkUrl);
                }
            }
        });

        // console.log('Title: ' + title);
        // console.log('Text length: ' + text.length);

        // let responseJson = JSON.parse(body);
        // console.log(responseJson)
        // let text = responseJson.query.pages[Object.keys(responseJson.query.pages)[0]].revisions[0]['*']; // Print the HTML for the Google homepage.

        let words = getWords(text);

        let link = {
            url: url,
            title: title,
            words: words, // {name, count}
            wordsLength: words.length,
            textLength: text.length,
            internalLinks: internalLinks, // ['']
            externalLinks: externalLinks
        };

        let savedLink = await database.saveLink(link);

        // console.log(savedLink)

        return savedLink;

    } catch (error) {
        console.log(error);
    }
};

let getWords = function (text) {

    //TODO no time for this, did it before in edflow

    let words = text.split(' ').reduce((prev, next) => {

        // console.log(prev)
        next = next.replace(/,|\.|:|'|\(|\)"|\?|;|!/, '')

        prev[next] = (prev[next] + 1) || 1;
        return prev;

    }, {});

    let sortable = [];
    for (let name in words) {
        if (name.length > 2) {
            let word = {name: name, count: words[name]};
            sortable.push(word);
        }
    }

    for (let id in sortable) {
        database.saveWord(sortable[id].name)
        // console.log(sortable[id].name + ' / ' + sortable[id].count)
    }

    sortable.sort(function (a, b) {
        return b.count - a.count;
    });

    // console.log('Words length: ' + sortable.length);
    // console.log('Global words length: ' + Object.keys(globalWords).length);

    return sortable;
}


