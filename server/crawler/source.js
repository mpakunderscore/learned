const database = require('../database/postgres');
const crawler = require('../crawler/crawler');
const storage = require('../storage');

const cheerio = require('cheerio');
const axios = require('axios');
const url = require('url');

// exports.checkSourceURL = async function (url) {
//
//     //TODO
//     let databaseSource = await database.getSource(url);
//
//     const response = await axios.get(encodeURI(url));
//     const data = response.data;
//     const $ = cheerio.load(data);
//
//     let pattern = '.storylink'
//     let links = $(pattern).toArray();
//
//     // if (links.length > 0)
//     //     database.saveSource(url, title, '').then()
//
//     for (let i in links) {
//         console.log(links[i].attribs.href)
//         await crawler.getURL(links[i].attribs.href)
//     }
//
//
//     console.log(links)
// }

exports.findLinksToSources = async function (matchesLength) {

    storage.sources = {}
    // let sources = [];

    let databaseLinks = await database.getLinks();

    for (let i in databaseLinks) {

        let link = databaseLinks[i].toJSON();

        // let databaseSource = await database.getSource(link.url);
        // if (databaseSource)
        //     continue;

        let currentLink = await crawler.getURLData(link.url)

        let matches = currentLink.externalLinks.filter(function (item) {
            return link.externalLinks.indexOf(item) === -1 && !item.includes(link.url.split('/')[0])
        })

        if (matches.length > matchesLength) {

            if (storage.sources[link.url]) {

                let matchesStorage = currentLink.externalLinks.filter(function (item) {
                    return storage.sources[link.url].externalLinks.indexOf(item) === -1 && !item.includes(link.url.split('/')[0])
                })

                if (matchesStorage.length > matchesLength) {
                    storage.sources[link.url] = {matches: matchesStorage, externalLinks: currentLink.externalLinks, count: storage.sources[link.url].count + 1}
                }

            } else {
                storage.sources[link.url] = {matches, externalLinks: currentLink.externalLinks, count: 0}
                // await database.saveSource(link.url, currentLink.title, '')
            }
        }
    }
}

exports.inspectSources = async function () {

    let databaseSources = await database.getSources();

    for (let i in databaseSources) {

        let currentLink = await crawler.getURLData(databaseSources[i].url)

        for (let j in currentLink.externalLinks) {
            await crawler.getURL(currentLink.externalLinks[j])
        }
    }
}