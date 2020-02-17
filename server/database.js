const {Sequelize, Model, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}
class Link extends Model {}
class UserLink extends Model {}
class Word extends Model {}
class Category extends Model {}

User.init({
    email: {
        type: DataTypes.STRING
    },
}, {sequelize, modelName: 'user'});

Link.init({
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {sequelize, modelName: 'link'});

UserLink.init({
    userid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {sequelize, modelName: 'userlink'});

Word.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
}, {sequelize, modelName: 'word'});

Category.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
}, {sequelize, modelName: 'category'});

sequelize.sync().then(() => {

    User.create({email: 'email'}).then(user => {
        console.log(user.toJSON());
    });
    Link.create({url: 'url'}).then(user => {
        console.log(user.toJSON());
    });
    UserLink.create({userid: 'bb888fae-4189-4c50-8381-363f937c8f78', url: 'url'}).then(user => {
        console.log(user.toJSON());
    });
});

exports.saveWord = (userid, url) => {
    let userLink = UserLink.create({userid: userid, url: url})
    console.log(userLink)
};

exports.getWords = async () => {
    return await Word.findAll();
};

exports.saveUserLink = (userid, url) => {
    let userLink = UserLink.create({userid: userid, url: url})
    console.log(userLink)
};

exports.getUserLinks = async (userid) => {
    return await UserLink.findAll({
        where: {
            userid: userid
        }
    });
};
