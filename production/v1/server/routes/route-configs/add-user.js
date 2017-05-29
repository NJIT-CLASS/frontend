'use strict';

var handler = require('../route-handlers/add-user');

module.exports = {
    route: '/add-user',
    title: 'Add User',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'user-plus',
    sidebar: true
};