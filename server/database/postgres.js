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
    return models.User.findAll();
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
    return models.Link.findOne({where: {url: url}})
};

// Get links

exports.getLinks = async () => {
    return models.Link.findAll();
};

// Save url for user.id. Nothing more

exports.saveUserLink = async (userid, url) => {
    let userLink = models.UserLink.create({userid: userid, url: url})
    let link = await crawler.getURLData(url);
    return link;
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
}
