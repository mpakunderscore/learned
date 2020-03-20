const wiki = require('../crawler/wiki');

const {Sequelize, Op} = require('sequelize');

module.exports.sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', {logging: false});

const crawler = require("../crawler/crawler");

let models = require("./models");

// {force: true}
module.exports.sequelize.sync().then(() => {
    console.log('database: on')
});

// Create or get user

exports.getUser = async (id) => {

    // console.log(id)

    let user;

    if (id) {

        let user = await models.User.findOne({where: {id: id}});

        if (user) {
            user.changed('updatedAt', true);
            user.save();
            return user.toJSON();
        }
    }

    user = await models.User.create({id: id});

    return user.toJSON();
};

// Get list of users

exports.getUsers = async () => {
    return models.User.findAll();
};

// Get lust of users today
exports.getUsersToday = async () => {

    let yesterday = new Date().setDate(new Date().getDate() - 1);
    // console.log(yesterday)
    return models.User.findAll({
        where: {
            updatedAt: {
                [Op.gt]: yesterday,
            }
        }
    });
}

// Save word or update word count (word in links)

exports.saveWord = (name) => {

    models.Word.findOne({where: {id: name}}).then(async function (word) {

        if (word)
            return word.update({count: word.count + 1});

        let page = await wiki.getPage(name);

        console.log(page.title);

        let databaseWord = await models.Word.create({id: name, categories: page.categories});

        return databaseWord;

    }).catch(function (err) {
        // console.error(err)
        console.error(name)
    });
};

// Get list of tokens (meaningful) based on words

exports.getWords = async () => {
    let words = await models.Word.findAll({order: [['count', 'DESC']]});
    return words.filter(word => word.categories.length > 0 && !word.categories.includes('Disambiguation pages'))
};

// Get list of words

exports.getAllWords = async () => {
    return models.Word.findAll({order: [['count', 'DESC']]});
};

// Get list of top words

exports.getTokenWords = async () => {

    let words = await models.Word.findAll({order: [['count', 'DESC']]});
    return words.filter(word => word.categories.length > 0 && tokenFilter(word))

    // !word.categories.includes('Disambiguation pages'))

    function tokenFilter(word) {

        return !word.categories.includes('Disambiguation pages') &&
            !word.categories.includes('English grammar') &&
            !word.categories.includes('Months') &&
            !word.categories.includes('Integers') &&
            !word.categories.includes('Grammar') &&
            !word.categories.includes('ISO basic Latin letters') &&
            isNaN(word.id);
    }
};

// Save link

exports.saveLink = async (link) => {

    let databaseLink = await models.Link.create(link)
    return databaseLink.toJSON();
};

// Get link

exports.getLink = async (url) => {
    return models.Link.findOne({where: {url: url}})
};

// Get links

exports.getLinks = async () => {
    return models.Link.findAll();
};

// Get links statistics

exports.getLinksShort = async () => {

    let links = await models.Link.findAll()
    let linksJson = [];

    for (let n in links) {
        let linkJson = links[n].toJSON();
        linksJson.push({
            title: linkJson.title,
            textLength: linkJson.textLength,
            wordsLength: linkJson.wordsLength,
            words: linkJson.words.splice(0, 15)
        })
    }

    return linksJson;
};

// Save url for user.id and create link object

exports.saveUserLink = async (userid, url) => {

    // TODO here check if user link exist
    // let userLink = models.UserLink.create({userid: userid, url: url})
    models.UserLink.findOne({where: {userid: userid, url: url}}).then(function (userLink) {
        if (!userLink)
            models.UserLink.create({userid: userid, url: url});
    });

    return await crawler.getURL(url);
};

// Get user links

exports.getUserLinks = async (userid) => {
    return models.UserLink.findAll({
        where: {
            userid: userid
        }
    });
};

// Delete user link

exports.deleteUserLink = async (userid, url) => {
    await models.UserLink.destroy({where: {userid: userid, url: url}})
    return true;
};

// Save category from wiki graph

exports.saveCategory = async (category) => {
    let databaseCategory = await models.Category.create(category).toJSON();
    return databaseCategory;
};

// Get one category

exports.getCategory = async (id) => {
    let category = await models.Category.findOne({where: {id: id}});
    return category;
};

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
};
