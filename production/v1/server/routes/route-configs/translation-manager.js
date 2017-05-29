'use strict';

var handler = require('../route-handlers/translation-manager');

module.exports = {
    route: '/translation-manager',
    title: 'Translation Manager',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        loggedOut: false
    },
    icon: 'globe',
    sidebar: true
};