const database = require('./database/postgres');
const source = require('./crawler/source');

exports.status = 'off';
exports.launchTime = 0;
exports.task = 'no';
exports.taskTime = 0;

exports.getStatus = () => {
    return exports;
}

// exports.timeout = 5 * 60 * 1000; // 5 min
exports.timeout = 60 * 1000; // 1 min
// exports.timeout = 5 * 1000; // 5 sec
// exports.timeout = 1 * 1000; // 1 sec

let intervalObject;

async function worker() {

    if (exports.task !== 'no')
        return;

    await inspectSources()
    await inspect()
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
    exports.task = 'links to sources';
    source.findLinksToSources(0).then(() => {
        exports.task = 'no';
    })
}

exports.init = () => {
    intervalObject = setInterval(worker, exports.timeout);
    exports.status = 'on';
    exports.launchTime = new Date().getTime()
}