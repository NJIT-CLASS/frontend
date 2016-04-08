/* @flow */

const redis = require('redis');
const async = require('async');

const consts = require('../utils/constants');

type Language = 'en' | 'fr' | 'es';

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

const addTranslation = function
(
    language: Language,
    str: string,
    translatedStr: string
) {
    const key = `${languageKeyPrefix}${str}`;
    client.exists(key, (err, result) => {
        // if the english version of the string doesn't exist yet add it
        if (result === 0) {
            return client.hset(key, 'en', str, (err, result) => {
                client.hset(key, language, translatedStr);
            });
        }

        client.hexists(key, 'en', (err, result) => {
            if (result === 0) {
                return client.hset(key, 'en', str, (err, result) => {
                    client.hset(key, language, translatedStr);
                });
            }

            client.hset(key, language, translatedStr);
        });
    });
};

exports.addTranslation = addTranslation;

const getTranslation = function
(
    language: Language,
    str: string,
    cb: (err: ?string, translation: string) => any
) {
    const key = `${languageKeyPrefix}${str}`;
    client.exists(key, (err, result) => {
        // if the string isn't in the db yet then add the english string
        if (result === 0) {
            addTranslation('en', str, str);
            return cb(null, str);
        }

        client.hget(key, language, (err, result) => {
            const resultStr = result !== null ? result : str;
            cb(null, resultStr);
        });
    });
};

exports.getTranslation = getTranslation;

exports.getAllStringsInLanguage = function
(
    language: Language,
    cb: (err: string, results: {}) => any
) {
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
