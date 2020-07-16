const database = require('./database/postgres');

exports.status = 'off';
exports.launchTime = 0;
exports.task = 'no';
exports.taskTime = 0;

let timeout = 5 * 60 * 1000; // 5 min
// let timeout = 1 * 1000; // 1 sec
let intervalObject;

async function worker() {

    if (exports.task !== 'no')
        return;

    await inspectSources().then()
    await inspect().then()
}

function inspectSources() {

    exports.task = 'inspect sources';
    exports.taskTime = new Date().getTime()
    database.getSources().then(sources => {

        for (let i in sources) {
            console.log(sources[i].toJSON())
        }

        exports.task = 'no';
    })
}

function inspect() {

}

exports.init = () => {
    intervalObject = setInterval(worker, timeout);
    exports.status = 'on';
    exports.launchTime = new Date().getTime()
}