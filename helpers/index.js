var crypto = require('crypto');

module.exports = function(ejs) {
     ejs.filters.md5Hash = function(string) {
         return crypto.createHash('md5').update(string).digest('hex');
    };
};
