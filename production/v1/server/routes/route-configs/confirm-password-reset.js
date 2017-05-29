'use strict';

var handler = require('../route-handlers/confirm-password-reset');

module.exports = {
    route: '/confirm-password-reset',
    title: 'Confirm Password Reset',
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