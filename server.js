const crawler = require("./server/crawler");
const wiki = require("./server/wiki");
const database = require("./server/database");

let express = require('express');
let app = express();

//static
app.use('/', express.static(__dirname + '/web'));

let server = require('http').Server(app);
server.listen(process.env.PORT || 8080);

//api
app.get('/api', function (request, response) {
    response.json({});
});

app.get('/url', async function (request, response) {
    response.json(await crawler.getURLsData([request.query.url1, request.query.url2]));
});

app.get('/wiki', async function (request, response) {
    response.json(await wiki.getWikiCategories(request.query.title, request.query.lang));
});

app.get('/user', async function (request, response) {

    // console.log(request.query.id)

    if (!request.query.id)
        response.json({id: uuidv4()});

    else
        response.json({id: request.query.id, data: {links: []}});
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

