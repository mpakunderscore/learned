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

exports.findLinksToSources = async function (index = 0) {

    // storage.sources = {}
    // let sources = [];

    let databaseLinks = await database.getLinks();

    for (let i in databaseLinks) {

        let link = databaseLinks[i].toJSON();

        // let databaseSource = await database.getSource(link.url);
        // if (databaseSource)
        //     continue;

        let count = 0;
        let lastDifference = 0;
        let sumDifference = 0;
        let timeoutRatio = 1;

        let storageSource = storage.sources[link.url];

        if (storageSource && storageSource.count < storageSource.timeoutRatio) {

            storageSource.count = storageSource.count + 1;
            storage.sources[link.url] = storageSource;
            continue;
        }

        let currentLink = await crawler.getURLData(link.url)
        if (!currentLink)
            continue;

        let matches = currentLink.externalLinks.filter(function (item) {
            return link.externalLinks.indexOf(item) === -1 // && !item.includes(link.url.split('/')[0])
        })

        matches = [...new Set(matches)]

        if (matches.length > 0) {

            if (storageSource) {

                matches = matches.concat(storageSource.matches);
                matches = [...new Set(matches)]

                count = storageSource.count + 1;
                lastDifference = matches.length - storageSource.matches.length;
                sumDifference = storageSource.sumDifference + lastDifference;
            }

            storage.sources[link.url] = {
                container: link.externalLinks.length,
                matches,
                count,
                lastDifference,
                sumDifference,
                timeoutRatio
            }
        }
    }
}

exports.inspectSources = async function () {

    let databaseSources = await database.getSources();

    for (let i in databaseSources) {

        let currentLink = await crawler.getURLData(databaseSources[i].url)

        for (let j in currentLink.externalLinks) {
            await crawler.getURL(currentLink.externalLinks[j].url)
        }
    }
}