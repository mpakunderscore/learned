require('dotenv').config();

const api = require('./server/api');
const storage = require('./server/storage');
const scheduler = require('./server/scheduler');

let express = require('express');
let app = express();

let server = require('http').Server(app);
server.listen(process.env.PORT || 8080);

app.use('/',     express.static(__dirname + '/web'));
app.use('/mine', express.static(__dirname + '/web'));
app.use('/chat', express.static(__dirname + '/web'));
app.use('/blog', express.static(__dirname + '/web'));

app.use('/demo', express.static(__dirname + '/web/demo'));
app.use('/coronavirus', express.static(__dirname + '/web'));

// app.use('/chrome/learned.space.zip', express.static(__dirname + '/learned.space.zip'));

api.init(app);
scheduler.init()


