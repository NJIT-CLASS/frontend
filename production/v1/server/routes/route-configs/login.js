'use strict';

var handler = require('../route-handlers/login');

module.exports = {
    route: '/',
    title: 'Login',
    routeHandler: handler,
    access: {
        admins: false,
        instructors: false,
        students: false,
        loggedOut: true
    },
    sidebar: false
};