'use strict';

var handler = require('../route-handlers/dashboard');

module.exports = {
    route: '/dashboard',
    title: 'Dashboard',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'dashboard',
    sidebar: true
};