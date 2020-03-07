let models = require("./models");

const database = require("./postgres");
const wiki = require("../crawler/wiki");

// Get user links and graph TODO redo dis, very bad. Need to be in postgres module

exports.getUserLinks = async (userid) => {
    let userLinks = await models.UserLink.findAll({
        where: {
            userid: userid
        }
    });

    // console.log(userLinks)

    let userLinksJson = []
    for (let i = 0; i < userLinks.length; i++) {

        let userLinkJson = userLinks[i].toJSON();

        //TODO foreign key or title field, or links global array by url key
        let link = await models.Link.findOne({
            where: {
                url: userLinkJson.url
            }
        })

        // console.log(link)

        userLinkJson.title = link.toJSON().title;
        userLinksJson.push(userLinkJson)
    }

    return userLinksJson;
};

// Get user graph based on user links TODO

exports.getUserTokens = async (userid) => {

    // TODO foreign key
    let userLinks = await models.UserLink.findAll({
        where: {
            userid: userid
        }
    });

    let links = []
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

    let words = await database.getWords(); // {id, categiries, pages}
    let globalWords = {}
    for (let id in words) {
        globalWords[words[id].id] = {count: words[id].count, categories: words[id].categories};
    }

    let linksWords = {};
    for (let i in links) {

        const link = links[i];

        if (link)
            getLinkTokens(link, linksWords, globalWords)
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

    let wordsCategoriesGraph = {};

    let i = 0;

    for (let id in words) {

        let word = words[id];

        // console.log(word.categories)

        for (let n in word.categories) {
            await getParentCategories(word.categories[n], wordsCategoriesGraph);
        }
    }

    return wordsCategoriesGraph;
};

let getParentCategories = async function (category, userGraphCategories) {

    console.log('getParentCategories: ' + category)

    if (userGraphCategories[category]) {
        userGraphCategories[category].count += 1;
    } else {
        userGraphCategories[category] = {count: 1, subcategories: []}
    }

    let upperCategories = (await wiki.getWikiCategories(category)).categories; // []

    let topCategory = false;

    console.log(upperCategories)

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

        // console.log(upperCategories[id])

        if (!upperCategories[id])
            return;

        if (userGraphCategories[upperCategories[id]]) {

            // console.log(userGraphCategories[upperCategories[id]])

            if (!userGraphCategories[upperCategories[id]].subcategories.includes(category))
                userGraphCategories[upperCategories[id]].subcategories.push(category);

            userGraphCategories[upperCategories[id]].count += 1;

        } else {
            userGraphCategories[upperCategories[id]] = {subcategories: [category], count: 1};
        }

        // console.log(upperCategories[id] + ': ' + userGraphCategories[upperCategories[id]].count)

        if (topCategory) {

            console.log('TOP CATEGORY: ' + category + ' / ' + userGraphCategories[category].count)
            return;

        } else
            await getParentCategories(upperCategories[id], userGraphCategories);

    }
}
