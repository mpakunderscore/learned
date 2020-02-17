const utils = require("./utils");
const crawler = require("./crawler");
const wiki = require("./wiki");
const database = require("./database");

exports.init = (app) => {

    //api
    app.get('/api', function (request, response) {
        response.json({});
    });


    app.get('/url', async function (request, response) {
        response.json(await crawler.getURLData(request.query.url));
    });

    app.get('/urls', async function (request, response) {
        response.json(await crawler.getURLsData([request.query.url1, request.query.url2]));
    });


    app.get('/words', async function (request, response) {
        response.json(await database.getWords());
    });


    app.get('/wiki', async function (request, response) {
        response.json(await wiki.getWikiCategories(request.query.title, request.query.lang));
    });


    app.get('/user', async function (request, response) {

        // console.log(request.query.id)

        if (!request.query.id)
            response.json({id: utils.uuidv4()});

        else
            response.json({id: request.query.id, data: {links: []}});
    });


    app.get('/link', async function (request, response) {
        response.json(await database.saveUserLink(request.query.userid, request.query.url));
    });

    app.get('/links', async function (request, response) {
        let links = await database.getUserLinks(request.query.userid);
        console.log(links)
        response.json(links);
    });


}
