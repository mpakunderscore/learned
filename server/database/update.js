const crawler = require("../crawler/crawler");

let models = require("./models");

// Update links

exports.updateLinks = async () => {

    let links = await models.Link.findAll();
    for (let i = 0; i < links.length; i++) {

        console.log(links[i].toJSON().title);
        let newLink = await crawler.getURLData(links[i].toJSON().url);
        links[i].words = newLink.words;
        await links[i].save();
    }

    return links;
};

// Update words

exports.updateWords = async () => {

    let words = await models.Word.findAll();
    for (let i = 0; i < words.length; i++) {

        console.log(words[i].toJSON().id);
        // let newWords = await crawler.getURLData(links[i].toJSON().url);
        words[i].count = 0;
        await words[i].save();
    }

    return words;
};
