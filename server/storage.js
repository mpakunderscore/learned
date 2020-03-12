const database = require("./database/postgres");
const wiki = require("./crawler/wiki");

// up to 5k
exports.links = {};
exports.words = {};
exports.categories = {};

exports.init = async () => {

    let categories = await database.getCategories();
    for (let i = 0; i < categories.length; i++) {
        exports.categories[categories[i].id] = categories[i].toJSON();
    }

    let words = await database.getWords();
    for (let i = 0; i < words.length; i++) {
        exports.words[words[i].id] = words[i].toJSON();
    }

    const allWords = await database.getAllWords();

    console.log(
        'storage.categories: ' + categories.length +
        ' / storage.tokens: ' + words.length +
        ' / storage.words: ' + allWords.length
    )
};

// TODO hmm
exports.getCategory = async (title) => {
    let category = exports.categories[title];
    if (!category)
        category = await wiki.getWikiCategories(title);

    return category;
}


