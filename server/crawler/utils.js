// TODO
exports.exclude = [
    'a', 'after', 'all', 'also', 'an', 'and', 'are', 'as', 'at',
    'be', 'been', 'but', 'by', 'can', 'first', 'for', 'from', 'from',
    'had', 'has', 'have', 'he', 'his', 'if', 'in', 'is', 'it', 'its',
    'later', 'may', 'more', 'of', 'on', 'or', 'other', 'so', 'such',
    'than', 'that', 'the', 'their', 'they', 'this', 'to', 'use', 'using',
    'was', 'were', 'when', 'which', 'with', 'you', 'thus', 'retrieved'
];

exports.separator = /(?:\n|\t|–|—|-|−|\.|\/)/g;

exports.garbage = /(?:,|\.|:|'|’|'|"|\(|\)|\[|\]|\?|;|!|\^|(\d+)|\$|=|\+|&|>|<|·|{|})/g;
