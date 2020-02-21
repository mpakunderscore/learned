let sequelize = require('./database').sequelize;;

const {Model, DataTypes} = require('sequelize');


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

module.exports = {
    User,
    Link,
    UserLink,
    Word,
    Category
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
}, {sequelize, modelName: 'category', timestamps: false});
