const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const consts = require('../utils/constants');

const sessionOptions = {
    host: consts.REDIS_HOST,
    port: consts.REDIS_PORT,
    disableTTL: true
};

const newSession = session({
    store: new RedisStore(sessionOptions),
    secret: consts.REDIS_SECRET
});

module.exports = newSession;