let sequelize = require('./postgres').sequelize;;

const {Model, DataTypes} = require('sequelize');


class User extends Model {
}

class Link extends Model {
}

class Source extends Model {
}

class UserLink extends Model {
}

class Word extends Model {
}

class Category extends Model {
}

class Message extends Model {
}

module.exports = {
    User,
    Link,
    UserLink,
    Word,
    Category,
    Message,
    Source
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
}, {sequelize, modelName: 'user'});

// TODO refactoring (date of creation page or news)
Link.init({
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    title: DataTypes.STRING,

    words: DataTypes.JSONB,

    textLength: DataTypes.INTEGER,
    wordsLength: DataTypes.INTEGER,

    internalLinks: DataTypes.JSONB,
    externalLinks: DataTypes.JSONB,


}, {sequelize, modelName: 'link', timestamps: false});

Source.init({
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    title: DataTypes.STRING,
    pattern: DataTypes.STRING, // CSS class or other route to link in links array
    icon: DataTypes.STRING,

}, {sequelize, modelName: 'source', timestamps: false});

UserLink.init({
    userid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize, modelName: 'userlink',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['userid', 'url']
        }
    ]});

// TODO refactoring (redirect from 's)
Word.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    categories: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
}, {sequelize, modelName: 'word', timestamps: false});

Category.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    subcategories: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    categories: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    pages: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    mainPage: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },
    language: {
        type: DataTypes.STRING,
    },

}, {sequelize, modelName: 'category', timestamps: false});

Message.init({
    userid: {
        type: DataTypes.STRING,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {sequelize, modelName: 'message', timestamps: true});
