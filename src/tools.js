const crypto = require('crypto');

function randomKey (length) {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex');
}

module.exports = { randomKey };
