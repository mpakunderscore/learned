const wiki = require('../crawler/wiki');

const {Sequelize} = require('sequelize');

module.exports.sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', {logging: false});

const crawler = require("../crawler/crawler");

let models = require("./models");

// {force: true}
module.exports.sequelize.sync().then(() => {});

// Create or get user

exports.getUser = async (id) => {

    // console.log(id)

    let user;

    if (id) {

        let user = await models.User.findOne({where: {id: id}});

        if (user)
            return user.toJSON();
    }

    user = await models.User.create({id: id});

    return user.toJSON();
};

// Get list of users

exports.getUsers = async () => {
    return await models.User.findAll();
};

// Save word or update word count (word in links)

exports.saveWord = (name) => {

    models.Word.findOne({where: {id: name}}).then(async function (word) {

        if (word)
            return word.update({count: word.count + 1});

        let page = await wiki.getWikiPage(name);

        // console.log(page);

        let databaseWord = await models.Word.create({id: name, categories: page.categories});

        return databaseWord;

    }).catch(function (err) {
        // console.error(err)
        console.error(name)
    });
};

// Get list of words

exports.getWords = async () => {
    let words = await models.Word.findAll();
    return words.filter(word => word.categories.length > 0 && !word.categories.includes('Disambiguation pages'))
};

// Save link

exports.saveLink = async (link) => {

    let databaseLink = await models.Link.create(link)
    return databaseLink.toJSON();
};

// Get link

exports.getLink = async (url) => {
    let link = models.Link.findOne({where: {url: url}})
    return link;
};

// Get links

exports.getLinks = async () => {
    let links = models.Link.findAll()
    return links;
};

// Save url for user.id. Nothing more

exports.saveUserLink = async (userid, url) => {
    let userLink = models.UserLink.create({userid: userid, url: url})
    let link = await crawler.getURLData(url);
    return link;
    // console.log(userLink)
};

// Delete user link

exports.deleteUserLink = async (userid, url) => {
    let userLink = models.UserLink.create({userid: userid, url: url})
    let link = await crawler.getURLData(url);
    return link;
    // console.log(userLink)
};

// Get user links and graph

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

exports.getUserWords = async (userid) => {

    // opened links
    // added links
    // saved categories
    // language

    let userLinks = await models.UserLink.findAll({
        where: {
            userid: userid
        }
    });

    let words = await exports.getWords(); // {id, categiries, pages}
    let globalWords = {}
    for (let id in words) {
        globalWords[words[id].id] = {count: words[id].count, categories: words[id].categories};
    }

    // console.log(words)

    // let categories = await exports.getCategories(); // {id, categiries, pages}

    let userWords = {};
    for (let id in userLinks) {

        let userLinkUrl = userLinks[id].toJSON().url;

        const link = await exports.getLink(userLinkUrl);

        if (link)
            for (let id in link.words) {

                let name = link.words[id].name;

                // console.log(words[name])

                if (userWords[name])
                    userWords[name].count += link.words[id].count;

                else if (globalWords[name] && isNaN(name) && !globalWords[name].categories.includes('English grammar')) //English words
                        userWords[name] = {count: link.words[id].count, globalCount: globalWords[name].count, categories: globalWords[name].categories};
            }
    }

    return userWords;
};

// let graphCategories = {};

exports.getWordsGraph = async (words) => {

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

        if (userGraphCategories[upperCategories[id]]) {

            console.log(userGraphCategories[upperCategories[id]])

            if (!userGraphCategories[upperCategories[id]].subcategories.includes(category))
                userGraphCategories[upperCategories[id]].subcategories.push(category);

            userGraphCategories[upperCategories[id]].count += 1;

        } else {
            userGraphCategories[upperCategories[id]] = {subcategories: [category], count: 1};
        }

        console.log(upperCategories[id] + ': ' + userGraphCategories[upperCategories[id]].count)

        if (topCategory) {

            console.log('TOP CATEGORY: ' + category + ' / ' + userGraphCategories[category].count)
            return;

        } else
            await getParentCategories(upperCategories[id], userGraphCategories);

    }
}

// Save category from wiki graph

exports.saveCategory = async (category) => {
    let databaseCategory = await models.Category.create(category)
    return databaseCategory.toJSON();
};

// Get one category

exports.getCategory = async (id) => {
    let category = await models.Category.findOne({where: {id: id}});
    return category;
}

// List of categories graph

exports.getCategories = async () => {
    let categories = await models.Category.findAll();
    return categories;
};

// Get user

exports.getStatistics = async () => {
    let statistics = {};
    statistics.words = await models.Word.count()
    statistics.links = await models.Link.count()
    statistics.users = await models.User.count()
    statistics.userLinks = await models.UserLink.count()
    statistics.categories = await models.Category.count()
    return statistics;
}
