require('dotenv').config();

const api = require('./server/api');
const storage = require("./server/storage");

let express = require('express');
// let router = express.Router({ strict: true });
// let app = express({ strict: true });
let app = express();

// app.set('strict routing', true)

app.use('/', express.static(__dirname + '/web'));

app.use('/demo', express.static(__dirname + '/web'));

// TODO i dont want this redirect to last backslash
app.use('/coronavirus', express.static(__dirname + '/web'));

let server = require('http').Server(app);
server.listen(process.env.PORT || 8080);

storage.init().then(() => {
    console.log('server.status: on')
});

api.init(app);


