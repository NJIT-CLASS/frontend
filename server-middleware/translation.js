const i18n = require('i18n');

const consts = require('../utils/constants');

i18n.configure({
    locales: ['en', 'es','fr'],
    defaultLocale: 'en',
    directory: `${consts.ROOT_DIRECTORY_PATH}/locales`
});

exports.middleware = i18n.init;

exports.translate = i18n.__;

exports.setTranslationLocale = i18n.setLocale;
