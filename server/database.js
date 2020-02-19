const {Sequelize, Model, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:', {logging: false});

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
    uuid: {
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
    Word.create({id: 'the'}).then(user => {
        console.log(user.toJSON());
    });
    Category.create({id: 'music'}).then(user => {
        console.log(user.toJSON());
    });
});

exports.saveWord = (name) => {

    Word.findOne({where: {id: name}}).then(function (word) {

        // console.log(word)

        if (word)
            return word.update({count: word.count + 1});

        return Word.create({id: name});

    }).catch(function (err) {
        // console.error(err)
        console.error(name)
    });
};

exports.getWords = async () => {
    return await Word.findAll();
};

exports.saveUserLink = (userid, url) => {
    let userLink = UserLink.create({userid: userid, url: url})
    // console.log(userLink)
};

exports.getUserLinks = async (userid) => {
    return await UserLink.findAll({
        where: {
            userid: userid
        }
    });
};

function upsert(values, condition) {
    return Model
        .findOne({where: condition})
        .then(function (obj) {
            // update
            if (obj)
                return obj.update(values);
            // insert
            return Model.create(values);
        })
}
