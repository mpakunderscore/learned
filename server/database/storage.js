const database = require("./postgres");

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

    console.log('Stored categories: ' + Object.keys(exports.categories).length)
};


