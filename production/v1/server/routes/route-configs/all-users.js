'use strict';

var handler = require('../route-handlers/all-users');

module.exports = {
    route: '/all-users',
    title: 'All Users',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        loggedOut: false
    },
    icon: 'users',
    sidebar: true
};