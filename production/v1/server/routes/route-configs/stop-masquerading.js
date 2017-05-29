'use strict';

var handler = require('../route-handlers/stop-masquerading');

module.exports = {
    route: '/stop-masquerading',
    title: 'Stop Masquerading',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: '',
    sidebar: false
};