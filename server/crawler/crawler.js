const database = require('../database/postgres');
const engine = require('./engine');

const cheerio = require('cheerio');
const axios = require('axios');

// First wiki result in google is a good way to find token word.

exports.getURLData = async function (url) {

    console.log('getURLData: ' + url);

    let databaseLink = await database.getLink(url);
    if (databaseLink)
        return databaseLink;

    // TODO hmm
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

        const text = getURLText($);

        const links = getURLLinks($, baseUrl);

        // console.log('Title: ' + title);
        // console.log('Text length: ' + text.length);

        // let responseJson = JSON.parse(body);
        // console.log(responseJson)
        // let text = responseJson.query.pages[Object.keys(responseJson.query.pages)[0]].revisions[0]['*']; // Print the HTML for the Google homepage.

        let words = await engine.getWords(text);





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


function getURLText($) {
    return $.root().text().toLowerCase().replace(/\n/g, '');
}

function getURLLinks($) {

    let links = {};
    links.internal = [];
    links.external = [];
    $('a').each(function (i, link) {

        let linkUrl = $(link).attr('href');

        if (linkUrl) {
            if (linkUrl.includes('http'))
                links.external.push(linkUrl);
            else {
                links.internal.push(c + '/' + linkUrl);
            }
        }
    });
}

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
