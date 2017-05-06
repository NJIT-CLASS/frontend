

const languageService = require('./language-service');

module.exports = function (redisClient) {
    return function(redisClient) {
        const service = languageService(redisClient);

        return {
            setupTranslations: (language, cb) => {
                service.getAllStringsInLanguage(language, (err, strs) => {
                    cb(function(language) {
                        return function (str) {
                            if (!(str in strs)) {
                                service.getTranslation(language, str, () => {});
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
