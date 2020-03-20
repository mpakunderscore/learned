const database = require('../database/postgres');
const engine = require('./engine');

const cheerio = require('cheerio');
const axios = require('axios');

// First wiki result in google is a good way to find token word.

exports.getURL = async function (url) {

    console.log('getURL: ' + url);

    let databaseLink = await database.getLink(url);

    if (databaseLink)
        return databaseLink;

    let link = await exports.getURLData(url)

    for (let i in link.words) {
        database.saveWord(link.words[i].id)
    }

    let savedLink = await database.saveLink(link);

    return savedLink;
}

exports.getURLData = async function (url) {

    // TODO hmm
    const urlArray = url.split( '/' );
    const protocol = urlArray[0];
    const host = urlArray[2];
    const baseUrl = protocol + '//' + host;

    try {
        const response = await axios.get(encodeURI(url));
        const data = response.data;
        const $ = cheerio.load(data);

        const title = $('title').text();

        const links = getURLLinks($, baseUrl);

        const text = getURLText($);

        let wordsList = engine.getWordsList(text);

        let words = await engine.getWords(wordsList);

        // console.log(wordsList.length / words.length)

        let link = {
            url: url,
            title: title,

            textLength: wordsList.length,
            wordsLength: words.length,

            // words and bigrams
            words: words, // {id, count}

            internalLinks: links.internal, // ['']
            externalLinks: links.external // ['']
        };

        return link;

    } catch (error) {
        console.log(error);
    }
};

function getURLText($) {
    return $.root().text();
}

function getURLLinks($, baseUrl) {

    let links = {};
    links.internal = [];
    links.external = [];
    $('a').each(function (i, link) {

        let linkUrl = $(link).attr('href');

        if (linkUrl) {
            if (linkUrl.includes('http'))
                links.external.push(linkUrl);
            else {
                links.internal.push(baseUrl + '/' + linkUrl);
            }
        }
    });

    return links;
}

// exports.crawlURLLinks = async function (url) {
//
//     let subPages = [];
//     let page = await exports.getURL(url);
//
//     // async page.internalLinks.forEach(link => {
//     //     subPages.push(await exports.getURLData(link));
//     // })
//
//     for (const link of page.internalLinks) {
//         subPages.push(await exports.getURL(link));
//     }
//
//     return subPages;
// };
