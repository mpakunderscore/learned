// let express = require('express');
// let router = express.Router();

const utils = require("./utils");
const crawler = require("./crawler");
const wiki = require("./wiki");
const database = require("./database");

exports.init = (app) => {

    // get url graph
    app.get('/url', async function (request, response) {

        let urlData = await crawler.getURLData(request.query.url);

        if (request.query.short === 'true')
            urlData.words = urlData.words.splice(0, 7);

        response.json(urlData);
    });

    app.get('/crawl', async function (request, response) {

        let linksArray = await crawler.crawlURLLinks(request.query.url);

        // if (request.query.short === 'true')
        //     urlData.words = urlData.words.splice(0, 7);

        response.json(linksArray);
    });

    // app.get('/urls', async function (request, response) {
    //     response.json(await crawler.getURLsData([request.query.url1, request.query.url2]));
    // });

    // get all words
    app.get('/words', async function (request, response) {
        response.json(await database.getWords());
    });

    // get wiki next categories in graph
    app.get('/wiki', async function (request, response) {
        response.json(await wiki.getWikiCategories(request.query.title, request.query.lang));
    });

    // init user
    app.get('/user', async function (request, response) {
        if (!request.query.id)
            response.json({id: utils.uuidv4()});
        else
            response.json({id: request.query.id, data: {links: []}});
    });

    // add link to user
    app.get('/link', async function (request, response) {
        response.json(await database.saveUserLink(request.query.userid, request.query.url));
    });

    // get user list of links
    app.get('/links', async function (request, response) {
        let links = await database.getUserLinks(request.query.userid);
        // console.log(links)
        response.json(links);
    });

    let routes = [];
    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            routes.push(r.route.path)
        }
    });

    app.get('/api', function (request, response) {
        response.json(routes);
    });
}