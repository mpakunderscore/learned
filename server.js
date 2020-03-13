require('dotenv').config();

const api = require('./server/api');
const storage = require("./server/storage");

let express = require('express');
let app = express();

app.use('/', express.static(__dirname + '/web'));

// app.use((req, res, next) => {
//     const test = /\?[^]*\//.test(req.url);
//     if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
//         res.redirect(301, req.url.slice(0, -1));
//     else
//         next();
// });

app.use('/demo', express.static(__dirname + '/web'));

app.use('/coronavirus', express.static(__dirname + '/web'));

// app.use(function(req, res, next) {
//     if (req.path.substr(-1) == '/' && req.path.length > 1) {
//         let query = req.url.slice(req.path.length);
//         res.redirect(301, req.path.slice(0, -1) + query);
//     } else {
//         next();
//     }
// });

// app.use('/language', express.static(__dirname + '/web'));

// app.router.get('\\S+\/$', function (req, res) {
//     return res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length));
// });

let server = require('http').Server(app);
server.listen(process.env.PORT || 8080);


storage.init().then(() => {
    console.log('server.status: on')
});

api.init(app);


