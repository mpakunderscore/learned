const database = require('./database/postgres');

exports.status = 'off';
exports.time = 0;
exports.task = 'no';

let timeout = 5 * 60 * 1000; // 5 min
let intervalObject;

function worker() {

    exports.time = new Date().getTime()
    exports.task = 'worker start';

    database.getSources().then(sources => {

        for (let i in sources) {

        }

        exports.task = 'no';
    })
}

exports.init = () => {
    intervalObject = setInterval(worker, timeout);
    exports.status = 'on';
}