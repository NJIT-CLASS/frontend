'use strict';

var async = require('async');

var consts = require('../utils/constants');

module.exports = function (redisClient) {
    return function (client) {
        var languageKeyPrefix = 'lang::';

        var addString = function addString(str) {
            var key = '' + languageKeyPrefix + str;
            client.hset(key, 'en', str);
        };

        var stringExists = function stringExists(str) {
            var key = '' + languageKeyPrefix + str;
            client.exists(key);
        };

        var addTranslation = function addTranslation(language, str, translatedStr) {
            if (str == null) {
                return;
            }

            var key = '' + languageKeyPrefix + str;
            client.exists(key, function (err, result) {
                // if the english version of the string doesn't exist yet add it
                if (result === 0) {
                    return client.hset(key, 'en', str, function (err, result) {
                        client.hset(key, language, translatedStr);
                    });
                }

                client.hexists(key, 'en', function (err, result) {
                    if (result === 0) {
                        return client.hset(key, 'en', str, function (err, result) {
                            client.hset(key, language, translatedStr);
                        });
                    }

                    client.hset(key, language, translatedStr);
                });
            });
        };

        var getTranslation = function getTranslation(language, str, cb) {
            if (str == null) {
                cb(null, '');
            }

            var key = '' + languageKeyPrefix + str;
            client.exists(key, function (err, result) {
                // if the string isn't in the db yet then add the english string
                if (result === 0) {
                    addTranslation('en', str, str);
                    return cb(null, str);
                }
                client.hget(key, language, function (err, result) {
                    var resultStr = result !== null ? result : str;
                    cb(null, resultStr);
                });
            });
        };

        var getAllStringsInLanguage = function getAllStringsInLanguage(language, cb) {
            var _this = this;

            var key = languageKeyPrefix + '*';
            client.keys(key, function (err, keys) {
                var keyTranslationFuncs = {};

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var key = _step.value;

                        var keyPieces = key.split('lang::');
                        keyPieces.shift();
                        var str = keyPieces.join('');

                        keyTranslationFuncs[str] = getTranslation.bind(_this, language, str);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
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