/* @flow */

const redis = require('redis');
const async = require('async');

const consts = require('../utils/constants');

const client = redis.createClient({
    host: consts.REDIS_HOST,
    port: consts.REDIS_PORT,
    password: consts.REDIS_AUTH
});

const languageKeyPrefix = 'lang::';

const addString = (str) => {
    const key = `${languageKeyPrefix}${str}`;
    client.hset(key, 'en', str);
};

const stringExists = (str) => {
    const key = `${languageKeyPrefix}${str}`;
    client.exists(key, redis.print);
};

exports.addTranslation = (language: string, str: string, translatedStr: string) => {
    addString(str);
};

const getTranslation = (language, str, cb: (err: ?string, result: string) => any) => {
    const key = `${languageKeyPrefix}${str}`;
    client.hget(key, language, (err, result) => {
        const resultStr = result !== null ? result : str;
        cb(null, resultStr);
    });
};

exports.getAllStringsInLanguage = (language: string, cb: (err: string, results: {}) => any) => {
    const key = `${languageKeyPrefix}*`;
    client.keys(key, (err, keys) => {
        var keyTranslationFuncs: { [key: string]: string } = {};

        for (var key of keys) {
            const keyPieces = key.split('lang::');
            keyPieces.shift();
            const str = keyPieces.join('');

            keyTranslationFuncs[str] = getTranslation.bind(this, language, str);
        }

        async.parallel(keyTranslationFuncs, cb);
    });
};
