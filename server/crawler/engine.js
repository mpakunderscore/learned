// Text analysis engine

exports.getWordsList = (text) => {

    // Words separators
    text = text.replace(/(?:\n|\t|–|-|\.|\/)/g, ' ');
    // Get words and remove empty elements
    let words = text.split(' ').filter(item => item);

    for (let i = 0; i < words.length; i++) {
        // Remove garbage
        words[i] = words[i].replace(/(?:,|\.|\.|:|'|\(|\)|\[|\]|"|\?|;|!)/g, '').trim();
        // There is words with first big letter, but TODO
        words[i] = words[i].toLowerCase()
    }

    words = words.filter(item => item);

    return words;
};

exports.getWords = async function (wordsList) {

    let bigrams = {};
    for (let i = 0; i < wordsList.length - 1; i++) {
        let bigram = wordsList[i] + ' ' + wordsList[i + 1];
        if (bigrams[bigram])
            bigrams[bigram] += 1;
        else
            bigrams[bigram] = 1;
    }

    let words = wordsList.reduce((prev, next) => {
        prev[next] = (prev[next] + 1) || 1;
        return prev;
    }, {});

    let sortable = [];
    for (let id in words) {
        let word = {id: id, count: words[id]};
        sortable.push(word);
    }
    for (let id in bigrams) {
        let bigram = {id: id, count: bigrams[id]};
        sortable.push(bigram);
    }

    for (let id in sortable) {
        // await database.saveWord(sortable[id].name)
        // console.log(sortable[id].name + ' / ' + sortable[id].count)
    }

    sortable.sort(function (a, b) {
        return b.count - a.count;
    });

    // console.log('Words length: ' + sortable.length);
    // console.log('Global words length: ' + Object.keys(globalWords).length);

    return sortable;
};
