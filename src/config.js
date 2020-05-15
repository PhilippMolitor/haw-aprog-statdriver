const path = require('path');
const fs = require('fs');
const { randomKey } = require("./tools");

const projectPath = path.resolve(__dirname, '../');

module.exports = {
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    dataPath: process.env.DATABASE_PATH || path.join(projectPath, 'data'),
    cookieSecret: process.env.COOKIE_SECRET || randomKey(16)
};

// check and maintain data directory
if (!fs.existsSync(module.exports.dataPath)) {
    fs.mkdirSync(module.exports.dataPath, { recursive: true });
}

