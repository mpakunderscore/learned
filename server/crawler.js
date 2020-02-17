const cheerio = require('cheerio')
const axios = require('axios');

let globalWords = {
    the: {
        used: true,
    }
};

// so, here we need the full words (?) of wiki word pages?
// after it..

// words fill categories for 100%

// если парсить все слова - это 5к запросов на первые документы. и лучше сразу писать в базу через фильтр
// причем писать сразу в графовую. и получается 2 графа. один это категории, второй это токены слов

exports.getURLsData = async function (urls) {

    let pages = [];
    urls.forEach(async url => {
        pages.push(await getURLData(url))
    });

    pages.forEach(async page => {
        setGraph(page)
    });

    return pages;
};

let setGraph = function (page) {

    page.tfidf = {};

    page.words.forEach(word => {
        page.tfidf[word] = word / globalWords[word];
    });
};

exports.getURLData = async function (url) {

    console.log(url);

    try {
        const response = await axios.get(url);
        const data = response.data;

        // console.log(data);

        const $ = cheerio.load(data);

        let title = $('title').text();
        let text = $.root().text().toLowerCase().replace(/\n/g, '');

        console.log('Title: ' + title);
        console.log('Text length: ' + text.length);

        // let responseJson = JSON.parse(body);
        // console.log(responseJson)
        // let text = responseJson.query.pages[Object.keys(responseJson.query.pages)[0]].revisions[0]['*']; // Print the HTML for the Google homepage.

        return {url: url, title: title, words: getWords(text), text: text.length};

    } catch (error) {
        console.log(error);
    }
};

let getWords = function (text) {

    let words = text.split(' ').reduce((prev, next) => {

        if (next.length === 1)
            return prev;

        prev[next] = (prev[next] + 1) || 1;
        return prev;

    }, {});

    let sortable = [];
    for (let name in words) {
        let word = {name: name, count: words[name]}
        sortable.push(word);
        globalWords[name] = 1 + globalWords[name];
    }

    sortable.sort(function (a, b) {
        return b.count - a.count;
    });

    console.log('Words length: ' + sortable.length)
    console.log('Global words length: ' + Object.keys(globalWords).length)

    return sortable;
}


