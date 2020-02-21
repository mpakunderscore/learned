const wiki = require('./wiki');

const {Sequelize} = require('sequelize');
module.exports.sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', {logging: false});

const crawler = require("./crawler");

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

exports.getUserLinks = async (userid) => {

    let userLinks = await models.UserLink.findAll({
        where: {
            userid: userid
        }
    });

    // TODO We don't have .words inside UserLink. And inside Link also.
    // Only in crawler method. Where we store Word model.

    // So. We need to get words here. Dynamically or from database.

    // console.log(userLinks)

    let words = {};
    for (let id in userLinks) {

        // let userLinkJson = userLink.toJSON();

        // console.log(userLinks[id].toJSON())

        let userLinkUrl = userLinks[id].toJSON().url;

        // console.log(userLinkJson.url)

        const link = await exports.getLink(userLinkUrl);
        // console.log(link)

        if (link)
            for (let id in link.words) {
                let name = link.words[id].name;
                if (words[name])
                    words[name] += link.words[id].count;
                else
                    words[name] = link.words[id].count;
            }

        for (let id in words) {
            if (words[id] < 10)
                delete words[id];
        }
    }

    return {list: userLinks, graph: words};
};


exports.getStatistics = async () => {
    let statistics = {};
    statistics.words = await models.Word.count()
    statistics.links = await models.Link.count()
    statistics.users = await models.User.count()
    statistics.userLinks = await models.UserLink.count()
    return statistics;
}
