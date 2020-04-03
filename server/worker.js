let models = require("./database/models");
const database = require("./database/postgres");

const wiki = require("./crawler/wiki");

const storage = require("./storage");

// Get user links titled

exports.getUserLinksTitled = async (userid) => {

    let userLinks = await database.getUserLinks(userid);

    // console.log(userLinks)

    let userLinksJson = [];
    for (let i = 0; i < userLinks.length; i++) {

        let userLinkJson = userLinks[i].toJSON();

        //TODO foreign key or title field, or links global array by url key
        // let link = await models.Link.findOne({
        //     where: {
        //         url: userLinkJson.url
        //     }
        // })

        let link = storage.links[userLinkJson.url];

        // console.log(link)

        // TODO
        if (link) {
            userLinkJson.title = link.title;
            userLinkJson.wordsLength = link.wordsLength;
            userLinkJson.textLength = link.textLength;
            userLinksJson.push(userLinkJson)
        }
        // else {
        //     userLinkJson.title = userLinkJson.url;
        //     userLinkJson.wordsLength = 0;
        //     userLinkJson.textLength = 0;
        //     userLinksJson.push(userLinkJson)
        // }
    }

    return userLinksJson;
};

// Get user graph based on user links TODO

exports.getUserTokens = async (userid) => {

    let userLinks = database.getUserLinks(userid);

    // TODO foreign key
    let links = [];
    for (let id in userLinks) {

        let userLinkUrl = userLinks[id].toJSON().url;
        const link = await database.getLink(userLinkUrl);

        if (link)
            links.push(link)
    }

    return exports.getLinksTokens(links);
};

// Tokens based on links []

exports.getLinksTokens = async (links) => {

    let linksWords = {};
    for (let i in links) {

        const link = links[i];

        if (link)
            getLinkTokens(link, linksWords)
    }

    // TODO here
    for (let name in linksWords) {
        if (linksWords[name].count < linksWords[name].globalCount)
            delete linksWords[name];
    }

    return linksWords;
};

let getLinkTokens = (link, linksWords) => {

    for (let id in link.words) {

        let name = link.words[id].id;

        // console.log(words[name])

        if (linksWords[name])
            linksWords[name].count += link.words[id].count;

        else if (storage.words[name]) //English words
            linksWords[name] = {count: link.words[id].count, globalCount: storage.words[name].count, categories: storage.words[name].categories};
    }
}

// Graph based on tokens []
let counter = 0;

let promiseArray = []

exports.getTokensGraph = async (words) => {

    let categoriesGraph = {};

    for (let id in words) {

        let word = words[id];

        for (let n in word.categories) {

            // TODO count work normal if only [].slice(0, 1)
            counter++;

            // TODO word.count

            promiseArray.push(new Promise(function(resolve, reject) {
                getParentCategories(word.categories[n], categoriesGraph, 0, [], word.count).then(() => resolve());
            }));
        }
    }

    // wait here until last thread

    return Promise.all(promiseArray).then(function(values) {
        return categoriesGraph;
    });
};

let topCategories = ['Main topic classifications', 'Wikipedia categories', 'Disambiguation pages'];

let getParentCategories = async function (category, userGraphCategories, depth, visitedArray = [], wordCount) {

    if (visitedArray.includes(category)) {
        console.error('LOOP version 2: ' + category);
        console.log(visitedArray)
        counter--;
        return;
    }

    // console.log(counter)

    visitedArray.push(category)

    if (userGraphCategories[category]) {
        userGraphCategories[category].count += 1;
    } else {
        userGraphCategories[category] = {count: wordCount, subcategories: [], depth: depth}
    }

    // console.log(category + ': ' + userGraphCategories[category].count + ' : ' + depth)

    let categoryObject = await storage.getCategory(category)
    let upperCategories = categoryObject.categories;

    let topCategory = false;
    upperCategories.forEach(c => {
        if (topCategories.includes(c)) {
            upperCategories = [c];
            topCategory = true;
        }
    });

    // console.log(upperCategories[0])

    // TODO SOMETHING WRONG HERE
    upperCategories = upperCategories.slice(0, 1);

    for (let id in upperCategories) {

        let upperCategory = upperCategories[id];

        // console.log(upperCategory)

        if (!upperCategory) {
            counter--;
            continue;
        }


        if (userGraphCategories[upperCategory]) {

            if (!userGraphCategories[upperCategory].subcategories.includes(category))
                userGraphCategories[upperCategory].subcategories.push(category);

            userGraphCategories[upperCategory].count += 1;

        } else {
            userGraphCategories[upperCategory] = {subcategories: [category], count: wordCount, depth: depth + 1};
            // console.log(category)
        }

        // console.log(upperCategory + ': ' + userGraphCategories[upperCategory].depth)

        if (topCategory) {

            // console.log('TOP CATEGORY: ' + category + ' / ' + userGraphCategories[category].count)
            // TODO finish here
            // console.log(counter)
            counter--;
            return;

        // } else if (userGraphCategories[upperCategory].depth < userGraphCategories[category].depth) {
        //
        //     // Loop and poop is in Russian culture. And wiki categories loops is a really poops
        //     console.error('LOOP: ' + category + ' ' + userGraphCategories[category].depth + ' > ' + upperCategory + ' ' + userGraphCategories[upperCategory].depth);
        //     return;


        } else {

            // TODO start here
            // getParentCategories(upperCategory, userGraphCategories, depth + 1, [...visitedArray]).then();;
            promiseArray.push(new Promise(function(resolve, reject) {
                getParentCategories(upperCategory, userGraphCategories, depth + 1, [...visitedArray], wordCount).then(() => resolve());;
            }));
        }
    }
};
