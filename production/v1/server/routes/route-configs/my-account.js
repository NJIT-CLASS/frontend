'use strict';

var handler = require('../route-handlers/my-account');

module.exports = {
    route: '/my-account',
    title: 'My Account',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'cog',
    sidebar: false
};