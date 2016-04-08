/* @flow */

const languageService = require('./language-service');

type Language = 'en' | 'fr' | 'es';

exports.setupTranslations = (language: Language, cb: (translateFunc: (str: string) => string) => any) => {
    languageService.getAllStringsInLanguage(language, (err: ?string, strs: { [key: string]: string }) => {
        cb(function() {
            return function (str: string) {
                if (!(str in strs)) {
                    languageService.getTranslation(language, str, () => {});
                }

                return strs[str];
            }
        }());
    });
};
