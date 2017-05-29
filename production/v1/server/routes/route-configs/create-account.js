'use strict';

var handler = require('../route-handlers/create-account');

module.exports = {
    route: '/create-account/:id',
    title: 'Create Account',
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