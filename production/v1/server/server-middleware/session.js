'use strict';

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var consts = require('../utils/constants');

var newSession = function () {
    return function (redisClient) {
        return session({
            store: new RedisStore({
                client: redisClient,
                disableTTL: true
            }),
            secret: consts.REDIS_SECRET,
            resave: false,
            saveUninitialized: true
        });
    };
}();

module.exports = newSession;