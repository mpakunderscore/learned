// Text analysis engine

exports.getWords = async function (text) {

    //TODO No time for this, did it before in edflow

    let words = text.split(' ').reduce((prev, next) => {

        // console.log(prev)
        // TODO I know, i know. You are a god of regex. Once upon a time i spent 3 days on favicon parser.
        // Is this necessary? AT LAST, BIGRAMS NECESSARY!
        next = next.replace(/,|\.|:|'|\(|\)"|\?|;|!/, '')

        prev[next] = (prev[next] + 1) || 1;
        return prev;

    }, {});

    let sortable = [];
    for (let name in words) {
        if (name.length > 2) {
            let word = {name: name, count: words[name]};
            sortable.push(word);
        }
    }

    for (let id in sortable) {
        await database.saveWord(sortable[id].name)
        // console.log(sortable[id].name + ' / ' + sortable[id].count)
    }

    sortable.sort(function (a, b) {
        return b.count - a.count;
    });

    // console.log('Words length: ' + sortable.length);
    // console.log('Global words length: ' + Object.keys(globalWords).length);

    return sortable;
};
