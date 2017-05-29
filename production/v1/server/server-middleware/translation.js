'use strict';

var languageService = require('./language-service');

module.exports = function (redisClient) {
    return function (redisClient) {
        var service = languageService(redisClient);

        return {
            setupTranslations: function setupTranslations(language, cb) {
                service.getAllStringsInLanguage(language, function (err, strs) {
                    cb(function (language) {
                        return function (str) {
                            if (!(str in strs)) {
                                service.getTranslation(language, str, function () {});
                                return str;
                            }

                            return strs[str];
                        };
                    }(language));
                });
            }
        };
    }(redisClient);
};