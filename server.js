require('dotenv').config();

const api = require('./server/api');
const storage = require("./server/storage");

let express = require('express');
let app = express();

// const router = express.Router({ strict: true })
// app.use(router)

// TODO i don't want this redirect to last backslash

// let router = express.Router({ strict: true });
// let app = express({ strict: true });
// app.set('strict routing', true)

app.use('/', express.static(__dirname + '/web'));

app.use('/demo', express.static(__dirname + '/web'));

app.use('/coronavirus', express.static(__dirname + '/web'));

app.use('/mine', express.static(__dirname + '/web'));

// TODO also we need routing for menu here. And menu array

let server = require('http').Server(app);
server.listen(process.env.PORT || 8080);

storage.init().then();

api.init(app);


