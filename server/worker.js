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
        let link = await models.Link.findOne({
            where: {
                url: userLinkJson.url
            }
        });

        // console.log(link)

        if (link) {
            userLinkJson.title = link.toJSON().title;
            userLinksJson.push(userLinkJson)
        }
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
            getLinkTokens(link, linksWords, storage.words)
    }

    return linksWords;
};

let getLinkTokens = (link, linksWords, globalWords) => {

    for (let id in link.words) {

        let name = link.words[id].name;

        // console.log(words[name])

        if (linksWords[name])
            linksWords[name].count += link.words[id].count;

        else if (globalWords[name] && isNaN(name) && !globalWords[name].categories.includes('English grammar')) //English words
            linksWords[name] = {count: link.words[id].count, globalCount: globalWords[name].count, categories: globalWords[name].categories};
    }
}

// Graph based on tokens []

exports.getTokensGraph = async (words) => {

    let categoriesGraph = {};

    let i = 0;

    for (let id in words) {

        let word = words[id];

        // console.log(word.categories)

        for (let n in word.categories) {
            await getParentCategories(word.categories[n], categoriesGraph, 0);
        }
    }

    return categoriesGraph;
};

let getParentCategories = async function (category, userGraphCategories, depth) {

    if (userGraphCategories[category]) {
        userGraphCategories[category].count += 1;
    } else {
        userGraphCategories[category] = {count: 1, subcategories: [], depth: depth}
    }

    let categoryObject = await storage.getCategory(category)
    let upperCategories = categoryObject.categories;
    let topCategory = false;

    console.log(category + ': ' + userGraphCategories[category].count + ' : ' + depth)
    // console.log(upperCategories[0])

    if (upperCategories.indexOf('Main topic classifications') > -1) {
        upperCategories = ['Main_topic_classifications']
        topCategory = true;
    }

    if (upperCategories.indexOf('Wikipedia categories') > -1) {
        upperCategories = ['Wikipedia categories']
        topCategory = true;
    }

    if (upperCategories.indexOf('Disambiguation pages') > -1) {
        upperCategories = ['Disambiguation pages']
        topCategory = true;
    }

    // TODO
    upperCategories = [upperCategories[0]];

    for (let id in upperCategories) {

        let upperCategory = upperCategories[id];

        // console.log(upperCategory)

        if (!upperCategory)
            return;

        if (userGraphCategories[upperCategory]) {

            if (!userGraphCategories[upperCategory].subcategories.includes(category))
                userGraphCategories[upperCategory].subcategories.push(category);

            userGraphCategories[upperCategory].count += 1;

        } else {
            userGraphCategories[upperCategory] = {subcategories: [category], count: 1, depth: depth};
        }

        // console.log(upperCategory + ': ' + userGraphCategories[upperCategory].depth)

        if (topCategory) {

            console.log('TOP CATEGORY: ' + category + ' / ' + userGraphCategories[category].count)
            return;

        } else if (userGraphCategories[upperCategory].depth < userGraphCategories[category].depth) {

            console.error('LOOP: ' + category + userGraphCategories[category].depth + ' > ' + upperCategory + userGraphCategories[upperCategory].depth);
            return;

        } else
            await getParentCategories(upperCategory, userGraphCategories, depth + 1);

    }
}
