let express = require('express');

const crawler = require('./crawler/crawler');
const wiki = require('./crawler/wiki');
const source = require('./crawler/source');
const database = require('./database/postgres');
const update = require('./database/update');
const worker = require('./worker');
const storage = require('./storage');
const scheduler = require('./scheduler');
const api = require('./api');

// TODO move api on prefix url
const prefix = '/api';

exports.status = 'off';

exports.init = (app) => {

    // get url
    app.get(prefix + '/crawl', async function (request, response) {
        response.json(await crawler.getURL(request.query.url));
    });

    // compare url
    // app.get(prefix + '/compare', async function (request, response) {
    //     response.json(await crawler.compareURL(request.query.url));
    // });

    app.get(prefix + '/crawl/graph', async function (request, response) {

        let urlData = await crawler.getURLData(request.query.url);
        let urlDataJson = JSON.parse(JSON.stringify(urlData));

        // if (request.query.short === 'true')
        //     urlDataJson.words = urlDataJson.words.splice(0, 25);

        let tokens = await worker.getLinksTokens([urlDataJson]);

        // console.log(tokens.length)

        if (request.query.graph === 'true') {
            urlDataJson.tokens = tokens;
            urlDataJson.graph = await worker.getTokensGraph(tokens);
        }


        response.json(urlDataJson);
    });

    // TODO will be for active crawler
    // get pages from this url list links
    // app.get(prefix + '/crawl/links', async function (request, response) {
    //
    //     let linksArray = await crawler.crawlURLLinks(request.query.url);
    //     response.json(linksArray);
    // });

    // get wiki next categories in graph
    app.get(prefix + '/wiki', async function (request, response) {
        response.json(await wiki.getCategory(request.query.title, request.query.lang));
    });


    // init or get user
    app.get(prefix + '/user', async function (request, response) {
        response.json(await database.getUser(request.query.id));
    });

    // add link to user
    app.get(prefix + '/user/link/add', async function (request, response) {
        response.json(await database.saveUserLink(request.query.userid, request.query.url));
    });

    // delete user link
    app.get(prefix + '/user/link/delete', async function (request, response) {
        response.json(await database.deleteUserLink(request.query.userid, request.query.url));
    });


    // TODO dev api

    // get user list of links
    app.get(prefix + '/user/links', async function (request, response) {
        response.json(await worker.getUserLinksTitled(request.query.userid));
    });

    // get user words
    app.get(prefix + '/user/words', async function (request, response) {
        let links = await worker.getUserTokens(request.query.userid);
        response.json(links);
    });

    // get user graph
    app.get(prefix + '/user/graph', async function (request, response) {
        let links = await worker.getTokensGraph(await worker.getUserTokens(request.query.userid));
        response.json(links);
    });

    // send message by user
    app.get(prefix + '/user/message/send', async function (request, response) {
        // let links = await worker.getTokensGraph(await worker.getUserTokens(request.query.userid));
        response.json(await database.sendMessage(request.query.userid, request.query.text));
        // console.log(request.query.userid)
        // console.log(request.query.text)
    });

    // send message by user
    app.get(prefix + '/user/message/delete', async function (request, response) {
        // let links = await worker.getTokensGraph(await worker.getUserTokens(request.query.userid));
        response.json(await database.deleteMessage(request.query.userid, request.query.id));
        // console.log(request.query.userid)
        // console.log(request.query.text)
    });

    // send message by user
    app.get(prefix + '/user/messages', async function (request, response) {
        let messages = await database.getMessages(request.query.userid);
        response.json(messages);
    });

    // login by user
    app.get(prefix + '/user/login', async function (request, response) {
        let user = await database.getUserByEmail(request.query.userid, request.query.email);
        response.json(user);
    });





    // TODO dev api

    // list of all users
    app.get(prefix + '/users', async function (request, response) {
        response.json(await database.getUsers());
    });

    // list of all users today
    app.get(prefix + '/users/today', async function (request, response) {
        response.json(await database.getUsersToday());
    });

    // top by links
    app.get(prefix + '/users/links', async function (request, response) {
        response.json(await database.getUsersByLinksCount());
    });

    // get list of links
    app.get(prefix + '/links', async function (request, response) {
        response.json(await database.getLinks());
    });

    // get short list of links
    app.get(prefix + '/links/short', async function (request, response) {
        response.json(await database.getLinksShort());
    });

    // get list of sources
    app.get(prefix + '/sources', async function (request, response) {
        response.json(storage.sources.filter(source => source.difference > 0));
    });

    // //
    // app.get(prefix + '/sources/', async function (request, response) {
    //     response.json(storage.sources);
    // });

    // check link to sources
    app.get(prefix + '/sources/find', async function (request, response) {
        response.json(source.findLinksToSources(request.query.matches));
    });





    // update all links
    app.get(prefix + '/links/update', async function (request, response) {
        response.json(await update.updateLinks());
    });

    // TODO update all words
    app.get(prefix + '/words/update', async function (request, response) {
        response.json(await update.updateWords());
    });

    // TODO update all words count
    app.get(prefix + '/words/update/count', async function (request, response) {
        response.json(await update.updateWordsCounts());
    });








    // get all words
    app.get(prefix + '/words', async function (request, response) {
        response.json(await database.getWords());
    });

    // get all words
    app.get(prefix + '/words/all', async function (request, response) {
        response.json(await database.getAllWords());
    });

    // get all tokens
    app.get(prefix + '/words/tokens', async function (request, response) {
        response.json(await database.getTokenWords());
    });

    // get all garbage words
    app.get(prefix + '/words/garbage', async function (request, response) {
        response.json(await database.getGarbageWords());
    });

    // get all empty words
    app.get(prefix + '/words/empty', async function (request, response) {
        response.json(await database.getEmptyWords());
    });

    // get list of links
    app.get(prefix + '/categories', async function (request, response) {
        let categories = await database.getCategories();
        response.json(categories);
    });


    app.get(prefix + '/statistics', async function (request, response) {
        response.json(await database.getStatistics());
    });

    app.get(prefix + '/scheduler', async function (request, response) {
        response.json({status: scheduler.status, launch: new Date(scheduler.launchTime).toString(), task: scheduler.task, time: new Date(scheduler.taskTime).toString()});
    });

    app.get(prefix + '/status', async function (request, response) {
        response.json({api: api.status, database: database.status, storage: storage.status, scheduler: scheduler.status});
    });

    // TODO demo
    app.get(prefix + '/demo', async function (request, response) {
        let demoGraph = {'Chat': {count: 3, subcategories: ['Y Combinator companies', 'Y Combinator people'], active: false},
                        'Incoming links': {count: 2, subcategories: []},
                        'Reading process': {count: 2, subcategories: []}
                        };
        response.json({graph: demoGraph});
    });

    app.get(prefix + '/coronavirus', async function (request, response) {
        let demoGraph = {'2019–20 coronavirus pandemic': {count: 3, subcategories: []}};
        response.json({graph: demoGraph});
    });



    let routes = [];
    app._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            routes.push(r.route.path)
        }
    });

    app.get('/api', function (request, response) {
        response.json(routes);
    });

    exports.status = 'on';
    console.log('api.routes: ' + routes.length)
    console.log('api: on')
}
