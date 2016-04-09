/* @flow */

const languageService = require('./language-service');

type Language = 'en' | 'fr' | 'es';

module.exports = function (redisClient) {
    return function(redisClient) {
        return {
            setupTranslations: (language: Language, cb: (translateFunc: (str: string) => string) => any) => {
                languageService(redisClient).getAllStringsInLanguage(language, (err: ?string, strs: { [key: string]: string }) => {
                    cb(function(language) {
                        return function (str: string) {
                            if (!(str in strs)) {
                                languageService.getTranslation(language, str, () => {});
                                return str;
                            }

                            return strs[str];
                        }
                    }(language));
                });
            }
        }
    }(redisClient);
}
