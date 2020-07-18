const storage = require('../storage');
const launcher = require('../launcher');
const wiki = require('../crawler/wiki');

const {Sequelize, Op} = require('sequelize');

let logging = true;

module.exports.sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', {logging: logging});

const crawler = require('../crawler/crawler');

let models = require('./models');

exports.status = 'off';

// {force: true}
module.exports.sequelize.sync().then(() => {
    exports.status = 'on';
    console.log('database: on')
    storage.init().then(() => {
        if (!process.env.DATABASE_URL)
            launcher.init().then()
    });
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

//Get user by email

exports.getUserByEmail = async (userid, email) => {

    let user = await models.User.findOne({where: {email: email}});

    if (!user) {
        user = await models.User.findOne({where: {id: userid}});
        user.update({email: email});
    }

    return user.toJSON();
}

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
};

// Get list of users

exports.getUsersByLinksCount = async () => {
    return models.UserLink.findAll({
        attributes: ['userid', [module.exports.sequelize.fn('count', module.exports.sequelize.col('userid')), 'count']],
        group: ['userid'],
    });
};

// Save word or update word count (word in links)

exports.saveWord = (name) => {

    models.Word.findOne({where: {id: name}}).then(async function (word) {

        if (word)
            return word.update({count: word.count + 1});

        let page = await wiki.getPage(name);

        console.log(name);

        console.log(page.title.replace(' - Wikipedia').toLowerCase())

        let databaseWord = await models.Word.create({id: name, categories: page.categories});

        return databaseWord;

    }).catch(function (err) {
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

// Words filter

function tokenFilter(word) {

    return !word.categories.includes('Disambiguation pages') &&
        !word.categories.includes('English grammar') &&
        !word.categories.includes('Months') &&
        !word.categories.includes('Integers') &&
        !word.categories.includes('Grammar') &&
        !word.categories.includes('Punctuation') &&
        !word.categories.includes('ISO basic Latin letters') &&
        !word.categories.includes('Control characters') &&
        !word.categories.includes('404') &&
        isNaN(word.id);
}

// Get list of top words

exports.getTokenWords = async () => {

    let words = await models.Word.findAll({order: [['count', 'DESC']]});
    return words.filter(word => word.categories.length > 0 && tokenFilter(word))

    // !word.categories.includes('Disambiguation pages'))
};

// Get list of top garbage

exports.getGarbageWords = async () => {

    let words = await models.Word.findAll({order: [['count', 'DESC']]});
    return words.filter(word => word.categories.length > 0 && !tokenFilter(word))
};


// Get list of empty garbage

exports.getEmptyWords = async () => {

    let words = await models.Word.findAll({order: [['count', 'DESC']]});
    return words.filter(word => word.categories.length === 0)
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
    return models.Link.findAll({benchmark: true});
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
    let databaseCategory = await models.Category.upsert(category).toJSON();
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

// List of messages

exports.getMessages = async (userid) => {
    let messages = await models.Message.findAll();
    return messages;
}

// Create message

exports.sendMessage = async (userid, text) => {
    let message = await models.Message.create({userid: userid, text: text});
    return message;
}

// Delete message

exports.deleteMessage = async (id) => {
    await models.Message.destroy({where: {id: id}})
    return true;
}


// Get source

exports.getSource = async (url) => {
    models.Source.findOne({where: {url: url}}).then(function (source) {
        return source;
    });
}

// Get sources

exports.getSources = async () => {
    let sources = await models.Source.findAll(); //{order: [['count', 'DESC']]}
    return sources;
}

// Save source

exports.saveSource = async (url, title, icon) => {
    let source = await models.Source.create({url: url, title: title, icon: icon});
    return source;
}

exports.getStatistics = async () => {
    let statistics = {};
    statistics.words = await models.Word.count()
    statistics.links = await models.Link.count()
    statistics.users = await models.User.count()
    statistics.userLinks = await models.UserLink.count()
    statistics.categories = await models.Category.count()
    return statistics;
};
