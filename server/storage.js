const database = require("./database/postgres");
const wiki = require("./crawler/wiki");

exports.status = 'off';

// up to 50k
exports.links = {};
exports.words = {};
exports.categories = {};

// TODO you need to write in storage when new row incoming bro

exports.init = async () => {

    let categories = await database.getCategories();
    for (let i = 0; i < categories.length; i++) {
        exports.categories[categories[i].id] = categories[i].toJSON();
    }
    console.log('storage.categories: ' + categories.length);

    let links = await database.getLinks();
    for (let i = 0; i < links.length; i++) {
        exports.links[links[i].url] = links[i].toJSON();
    }
    console.log('storage.links: ' + links.length);

    // TODO this words is tokens with good categories
    let words = await database.getTokenWords();
    for (let i = 0; i < words.length; i++) {
        exports.words[words[i].id] = words[i].toJSON();
    }
    console.log('storage.tokens: ' + words.length);

    const allWords = await database.getAllWords();
    console.log('storage.words: ' + allWords.length);

    exports.status = 'on';
    console.log('storage: on')
};

// TODO hmm
exports.getCategory = async (title) => {
    let category = exports.categories[title];
    if (!category)
        category = await wiki.getCategory(title);

    return category;
}


