// TODO first word filter. Don't sure this is right
exports.exclude = [
    'a', 'after', 'all', 'also', 'an', 'and', 'are', 'as', 'at',
    'be', 'been', 'but', 'by', 'can', 'first', 'for', 'from', 'from',
    'had', 'has', 'have', 'he', 'his', 'if', 'in', 'is', 'it', 'its',
    'later', 'may', 'more', 'of', 'on', 'or', 'other', 'so', 'such',
    'than', 'that', 'the', 'their', 'they', 'this', 'to', 'use', 'using',
    'was', 'were', 'when', 'which', 'with', 'you', 'thus', 'retrieved'
];

// TODO is this different?
exports.separator = /(?:\n|\t|\||_|–|—|-|−|\.|\/)/g;

// TODO uh
exports.garbage = /(?:,|\.|:|’|‘|”|'|"|\(|\)|\[|\]|\?|;|!|\^|(\d+)|\$|=|\+|&|>|<|·|{|})/g;
