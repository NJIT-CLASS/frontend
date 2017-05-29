'use strict';

var handler = require('../route-handlers/administrator');

module.exports = {
    route: '/administrator',
    title: 'Administrator',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        loggedOut: false
    },
    icon: 'cogs',
    sidebar: true
};