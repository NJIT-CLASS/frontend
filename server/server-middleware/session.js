const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const consts = require('../utils/constants');

const newSession = function() {
    return function(redisClient) {
        return session({
            store: new RedisStore({
                client: redisClient,
                disableTTL: true
            }),
            secret: consts.REDIS_SECRET
        });
    };
}();

module.exports = newSession;