'use strict';

var handler = require('../route-handlers/masquerade');

module.exports = {
    route: '/masquerade',
    title: 'Masquerade',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        loggedOut: false
    },
    icon: '',
    sidebar: false
};