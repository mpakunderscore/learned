const database = require("./database/postgres");
const wiki = require("./crawler/wiki");

exports.status = 'off';

// up to 50k
exports.links = {};
exports.words = {};
exports.categories = {};

// TODO you need to write in storage when new row incoming bro

exports.init = async () => {

    let startTime = new Date();

    let links = await database.getLinks();
    for (let i = 0; i < links.length; i++) {
        exports.links[links[i].url] = links[i].toJSON();
    }
    console.log('storage.links: ' + links.length);
    console.log((new Date() - startTime)/1000)

    let categories = await database.getCategories();
    for (let i = 0; i < categories.length; i++) {
        exports.categories[categories[i].id] = categories[i].toJSON();
    }
    console.log('storage.categories: ' + categories.length);
    console.log((new Date() - startTime)/1000)

    // TODO this words is tokens with good categories
    let words = await database.getTokenWords();
    for (let i = 0; i < words.length; i++) {
        exports.words[words[i].id] = words[i].toJSON();
    }
    console.log('storage.tokens: ' + words.length);
    console.log((new Date() - startTime)/1000)

    const allWords = await database.getAllWords();
    console.log('storage.words: ' + allWords.length);
    console.log((new Date() - startTime)/1000)

    exports.status = 'on';
    console.log('storage: on')
    console.log((new Date() - startTime)/1000)
};

// TODO hmm
exports.getCategory = async (title) => {
    let category = exports.categories[title];
    if (!category)
        category = await wiki.getCategory(title);

    return category;
}


