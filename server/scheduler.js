const database = require('./database/postgres');

exports.status = 'off';

let timeout = 60 * 1000; // 60 sec
let intervalObject;

async function worker() {
    // console.log('')
    const links = await database.getSources()
    for (let i in links) {
        console.log(links[i].toJSON().url)

        await checkSource(links[i].toJSON().url)
    }
}

async function checkSource(url) {

    const response = await axios.get(encodeURI(url));
    const data = response.data;
    const $ = cheerio.load(data);

    let pattern = '.storylink'
    let links = $(pattern).toArray();
}

exports.init = () => {
    intervalObject = setInterval(worker, timeout);
}