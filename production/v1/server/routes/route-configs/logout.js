'use strict';

var handler = require('../route-handlers/logout');

module.exports = {
    route: '/logout',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: true
    },
    sidebar: false
};