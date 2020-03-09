require('dotenv').config();

const api = require('./server/api');
const storage = require("./server/storage");

let express = require('express');
let app = express();

app.use('/', express.static(__dirname + '/web'));

// app.use('/language', express.static(__dirname + '/web'));

let server = require('http').Server(app);
server.listen(process.env.PORT || 8080);

api.init(app);
// storage.init().then();


