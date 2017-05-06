

const async = require('async');

const consts = require('../utils/constants');


module.exports = function(redisClient){
    return function(client) {
        const languageKeyPrefix = 'lang::';

        const addString = (str) => {
            const key = `${languageKeyPrefix}${str}`;
            client.hset(key, 'en', str);
        };

        const stringExists = (str) => {
            const key = `${languageKeyPrefix}${str}`;
            client.exists(key);
        };

        const addTranslation = function(language,str,translatedStr) {
            if (str == null) {
                return;
            }

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

        const getTranslation = function(language,str,cb) {
            if (str == null) {
                cb(null, '');
            }

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

        const getAllStringsInLanguage = function(language, cb) {
            const key = `${languageKeyPrefix}*`;
            client.keys(key, (err, keys) => {
                var keyTranslationFuncs = {};

                for (var key of keys) {
                    const keyPieces = key.split('lang::');
                    keyPieces.shift();
                    const str = keyPieces.join('');

                    keyTranslationFuncs[str] = getTranslation.bind(this, language, str);
                }

                async.parallel(keyTranslationFuncs, cb);
            });
        };

        return {
            getAllStringsInLanguage: getAllStringsInLanguage,
            getTranslation: getTranslation,
            addTranslation: addTranslation
        };
    }(redisClient);
};
