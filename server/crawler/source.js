const database = require('../database/postgres');

exports.checkSourceLink = async function (url, $, title) {

    //TODO
    let databaseSource = await database.getSource(url);

    let pattern = '.storylink'
    let links = $(pattern).toArray();

    if (links.length > 0)
        database.saveSource(url, title, '').then()

    for (let i in links) {
        console.log(links[i].attribs.href)
    }


    console.log(links)
}

exports.inspectSources = async function () {

    let databaseSources = await database.getSources();

    for (let i in databaseSources) {
        databaseSources[i].toJSON();
    }
}