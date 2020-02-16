const {Sequelize, Model, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}
class Link extends Model {}
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
    User.create({email: 'test1@test.test'}).then(user => {
        console.log(user.toJSON());
    });
    User.create({email: 'test2@test.test'}).then(user => {
        console.log(user.toJSON());
    });
})
