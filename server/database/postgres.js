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

// Get user links and graph

exports.getUserLinks = async (userid) => {

    let userLinks = await models.UserLink.findAll({
        where: {
            userid: userid
        }
    });

    // let words = {};
    for (let id in userLinks) {

        // let userLinkUrl = userLinks[id].url;

        // const link = await exports.getLink(userLinkUrl);

        // userLinks[id]['title'] = link.title;

        // if (link)
        //     for (let id in link.words) {
        //         let name = link.words[id].name;
        //         if (words[name])
        //             words[name] += link.words[id].count;
        //         else
        //             words[name] = link.words[id].count;
        //     }
        //
        // for (let id in words) {
        //     if (words[id] < 3)
        //         delete words[id];
        // }
    }

    let categories = await exports.getCategories(); // {id, categiries, pages}

    // console.log(categories.length)

    // let userGraph = words;

    return userLinks;
};

exports.getUserGraph = async (userid) => {

    // opened links
    // added links
    // saved categories
    // language

    let userLinks = await models.UserLink.findAll({
        where: {
            userid: userid
        }
    });

    let words = {};
    for (let id in userLinks) {

        let userLinkUrl = userLinks[id].toJSON().url;

        const link = await exports.getLink(userLinkUrl);

        if (link)
            for (let id in link.words) {
                let name = link.words[id].name;
                if (words[name])
                    words[name] += link.words[id].count;
                else
                    words[name] = link.words[id].count;
            }

        for (let id in words) {
            if (words[id] < 3)
                delete words[id];
        }
    }

    return userLinks;
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
