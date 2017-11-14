/**
 * Created by sv on 2017/9/4.
 */
var crypto = require('crypto');
module.exports = function md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex');
};