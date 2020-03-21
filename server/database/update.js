const wiki = require('../crawler/wiki');
const crawler = require('../crawler/crawler');
const postgres = require('./postgres');
const storage = require('../storage');

// Update links

exports.updateLinks = async () => {

    let links = await postgres.getLinks();
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

    let words = await postgres.getAllWords();
    for (let i = 0; i < words.length; i++) {

        let page;

        if (words[i].categories.length === 0) {
            try {
                console.log(words[i].id);
                page = await wiki.getPage(words[i].id);
                let title = page.title.replace(' - Wikipedia', '').toLowerCase();
                if (title !== words[i].id)
                    console.error(title)
            } catch (e) {
            }
        }

        if (page && words[i].categories.length < page.categories.length) {
            words[i].categories = page.categories;
            await words[i].save();
        }

        // let databaseWord = await models.Word.create({id: name, categories: page.categories});
    }

    return words;
};

// Recount global words

exports.updateWordsCounts = async () => {

    let words = {};

    let links = await postgres.getLinks();
    for (let i = 0; i < links.length; i++) {
        for (let j = 0; j < links[i].words.length; j++) {

            let word = links[i].words[j];
            if (!word.id)
                continue;

            if (words[word.id])
                words[word.id] += 1;
            else
                words[word.id] = 1;
        }
    }

    let sortable = []
    for (let id in words) {

        if (!storage.words[id])
            continue;

        let word = {id: id, count: words[id], categories: storage.words[id] ? storage.words[id].categories : []};
        sortable.push(word);
    }

    sortable.sort(function (a, b) {
        return b.count - a.count;
    });

    // let words = await postgres.getAllWords();
    // for (let i = 0; i < words.length; i++) {
    //
    //     console.log(words[i].id);
    //     let page;
    //
    //     if (words[i].categories.length === 0) {
    //         try {
    //             page = await wiki.getPage(words[i].id);
    //             let title = page.title.replace(' - Wikipedia', '').toLowerCase();
    //             if (title !== words[i].id)
    //                 console.error(title)
    //         } catch (e) {
    //         }
    //     }
    //
    //     if (page && words[i].categories.length < page.categories.length) {
    //         words[i].categories = page.categories;
    //         await words[i].save();
    //     }
    //
    //     // let databaseWord = await models.Word.create({id: name, categories: page.categories});
    // }

    return sortable;
};
