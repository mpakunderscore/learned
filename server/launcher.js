let crawler = require('./crawler/crawler')

exports.status = 'off';

let urls = [
    'http://paulgraham.com/articles.html',
    'https://www.google.com/search?q=learning',
    'https://news.ycombinator.com/newest',
    'https://www.reddit.com/r/all/new/',
    // 'https://en.wikipedia.org/wiki/Turing_completeness'
]

exports.init = async () => {

    for (let i in urls) {
        await crawler.getURL(urls[i])
    }

    exports.status = 'on';
    console.log('launcher.urls: ' + urls.length)
    console.log('launcher: on')
}