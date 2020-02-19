const {Sequelize, Model, DataTypes} = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:');

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

exports.getUsers = async () => {

    return await User.findAll();
};

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

exports.getWords = async () => {
    return await Word.findAll();
};

exports.saveUserLink = (userid, url) => {
    let userLink = UserLink.create({userid: userid, url: url})
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

    let words = {};
    for (let userLink in userLinks) {
        for (let id in userLink.words) {
            let name = userLink.words[id].name;
            words[name] += userLink.words[id].count;
        }
    }

    return {list: userLinks, graph: words};
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
