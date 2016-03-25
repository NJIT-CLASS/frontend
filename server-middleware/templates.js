const handlebars = require('express-handlebars');

const __ = require('./translation').translate;
const consts = require('../utils/constants');

const helperFunctions = {};

// handlebars helper functions
helperFunctions.__ = function () {
    return __.apply(this, arguments);
};

helperFunctions.sidebarHighlighter = function(template, sidebarItem, options){
    if (template === sidebarItem){
        return options.fn(this);
    }
};

helperFunctions.showHTMLBasedOnBoolean = function(bool, options) {
    if (bool) {
        return options.fn(this);
    }
};

helperFunctions.ifEqual = function(arg1, arg2, options) {
    if (arg1 === arg2) {
        return options.fn(this);
    }
};


exports.config = handlebars.create({
    layoutsDir: `${consts.ROOT_DIRECTORY_PATH}/views/layouts/`,
    partialsDir: `${consts.ROOT_DIRECTORY_PATH}/views/`,
    defaultLayout: 'logged_in',
    extname: '.html',
    helpers: helperFunctions
});
