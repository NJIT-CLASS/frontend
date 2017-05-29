'use strict';

var handler = require('../route-handlers/settings');

module.exports = {
    route: '/settings',
    title: 'Settings',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'cogs',
    sidebar: false
};