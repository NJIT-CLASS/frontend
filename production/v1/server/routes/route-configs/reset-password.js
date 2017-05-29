'use strict';

var handler = require('../route-handlers/reset-password');

module.exports = {
    route: '/reset-password',
    title: 'Reset Password',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: true
    },
    icon: '',
    sidebar: false
};