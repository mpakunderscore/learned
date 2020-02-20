const {Sequelize, Model, DataTypes} = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:', {logging: false});

const crawler = require("./crawler");

class User extends Model {
}

class Link extends Model {
}

class UserLink extends Model {
}

class Word extends Model {
}

class Category extends Model {
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING
    },
}, {sequelize, modelName: 'user'});

Link.init({
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },

    title: DataTypes.STRING,

    words: DataTypes.JSONB,


    wordsLength: DataTypes.INTEGER,
    textLength: DataTypes.INTEGER,

    internalLinks: DataTypes.JSONB,
    externalLinks: DataTypes.JSONB,


}, {sequelize, modelName: 'link', timestamps: false});

UserLink.init({
    userid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {sequelize, modelName: 'userlink', timestamps: false});

Word.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {sequelize, modelName: 'word', timestamps: false});

Category.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
}, {sequelize, modelName: 'category', timestamps: false});

// {force: true}

sequelize.sync().then(() => {

    // User.create({id: 'bb888fae-4189-4c50-8381-363f937c8f78', email: null}).then(user => {
    //     console.log(user.toJSON());
    // });
    // Link.create({url: 'url'}).then(user => {
    //     console.log(user.toJSON());
    // });
    // UserLink.create({userid: 'bb888fae-4189-4c50-8381-363f937c8f78', url: 'url'}).then(user => {
    //     console.log(user.toJSON());
    // });
    // Word.create({id: 'the'}).then(user => {
    //     console.log(user.toJSON());
    // });
    // Category.create({id: 'music'}).then(user => {
    //     console.log(user.toJSON());
    // });
});




// Create or get user

exports.getUser = async (id) => {

    console.log(id)

    let user;

    if (id) {

        let user = await User.findOne({where: {id: id}});

        if (user)
            return user.toJSON();
    }

    user = await User.create({id: id});

    return user.toJSON();
};

// Get list of users

exports.getUsers = async () => {
    return await User.findAll();
};

// Save word or update word count (word in links)

exports.saveWord = (name) => {

    Word.findOne({where: {id: name}}).then(function (word) {

        if (word)
            return word.update({count: word.count + 1});

        return Word.create({id: name});

    }).catch(function (err) {
        // console.error(err)
        console.error(name)
    });
};

// Get list of words

exports.getWords = async () => {
    return await Word.findAll();
};

// Save link

exports.saveLink = async (link) => {

    let databaseLink = await Link.create(link)
    return databaseLink.toJSON();
};

// Get link

exports.getLink = async (url) => {
    let link = Link.findOne({where: {url: url}})
    return link;
};

// Get links

exports.getLinks = async () => {
    let links = Link.findAll()
    return links;
};

// Save url for user.id. Nothing more

exports.saveUserLink = async (userid, url) => {
    let userLink = UserLink.create({userid: userid, url: url})
    await crawler.getURLData(url)
    // console.log(userLink)
};

exports.getUserLinks = async (userid) => {

    let userLinks = await UserLink.findAll({
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
    }

    return {list: userLinks, graph: words};
};
