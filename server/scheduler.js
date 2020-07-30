const database = require('./database/postgres');
const source = require('./crawler/source');

exports.status = 'off';
exports.launchTime = 0;
exports.task = 'no';
exports.taskTime = 0;

exports.getStatus = () => {
    return exports;
}

exports.timeout = 5 * 60 * 1000; // 5 min
// exports.timeout = 60 * 1000; // 1 min
// exports.timeout = 5 * 1000; // 5 sec
// exports.timeout = 1 * 1000; // 1 sec

let intervalObject;

async function worker() {

    if (exports.task !== 'no')
        return;

    exports.task = 'source.inspectSources()';
    await source.inspectSources()
    exports.task = 'no';
}

exports.init = () => {
    intervalObject = setInterval(worker, exports.timeout);
    exports.status = 'on';
    exports.launchTime = new Date().getTime()
}