'use strict';

var handlebars = require('express-handlebars');
var moment = require('moment');
var consts = require('../utils/constants');

exports.setup = function (translate) {
    var helperFunctions = {};

    // handlebars helper functions
    helperFunctions.__ = function () {
        return translate.apply(this, arguments);
    };

    helperFunctions.sidebarHighlighter = function (template, sidebarItem, options) {
        if (template === sidebarItem) {
            return options.fn(this);
        }
    };

    helperFunctions.showHTMLBasedOnBoolean = function (bool, options) {
        if (bool) {
            return options.fn(this);
        }
    };

    helperFunctions.ifEqual = function (arg1, arg2, options) {
        if (arg1 === arg2) {
            return options.fn(this);
        }
        return options.inverse(this);
    };

    helperFunctions.ifEmpty = function (arg1, options) {
        if (arg1 === null || arg1 === undefined || arg1 === '' || arg1.length === 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    };
    helperFunctions.dateFormat = function (date) {
        return moment(date, 'YYYY-MM-DD  HH:mm:ss').format('MMMM Do, YYYY h:mm a');
    };

    helperFunctions.cutLength = function (str) {
        if (str.length > 25) {
            return str.substring(0, 25) + '...';
        } else {
            return str;
        }
    };
    helperFunctions.chain = function () {
        var helpers = [];
        var args = Array.prototype.slice.call(arguments);
        var argsLength = args.length;
        var index;
        var arg;

        for (index = 0, arg = args[index]; index < argsLength; arg = args[++index]) {
            if (Handlebars.helpers[arg]) {
                helpers.push(Handlebars.helpers[arg]);
            } else {
                args = args.slice(index);
                break;
            }
        }

        while (helpers.length) {
            args = [helpers.pop().apply(Handlebars.helpers, args)];
        }

        return args.shift();
    };

    return handlebars.create({
        layoutsDir: consts.ROOT_DIRECTORY_PATH + '/views/layouts/',
        partialsDir: consts.ROOT_DIRECTORY_PATH + '/views/',
        defaultLayout: 'logged_in',
        extname: '.html',
        helpers: helperFunctions
    });
};