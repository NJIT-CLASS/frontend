'use strict';

var handler = require('../route-handlers/about');

module.exports = {
    route: '/about',
    title: 'About',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'files-o',
    sidebar: true
};