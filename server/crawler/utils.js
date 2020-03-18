// TODO
exports.exclude = [
    'a', 'all', 'an', 'and', 'are', 'as', 'be', 'by',
    'for', 'has', 'have', 'in', 'is', 'it', 'of', 'on', 'or', 'other',
    'such', 'that', 'the', 'their', 'to', 'use', 'with',
    'his', 'he', 'after', 'was', 'which', 'more', 'from', 'but',
    'had', 'from', 'first', 'this', 'at', 'its', 'than', 'they',
    'when', 'also', 'can', 'if', 'you', 'so', 'may', 'were', 'using',
    'later', 'been'
];

exports.separator = /(?:\n|\t|–|—|-|−|\.|\/)/g;

exports.garbage = /(?:,|\.|:|'|\(|\)|\[|\]|"|\?|;|!|\^|(\d+)|\$|=|\+|&|>|<|·|{|})/g;
