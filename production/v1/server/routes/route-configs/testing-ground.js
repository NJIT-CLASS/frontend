'use strict';

var handler = require('../route-handlers/testing-ground');

module.exports = {
    route: '/testing',
    title: 'Testing Ground',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        loggedOut: false
    },
    icon: 'cog',
    sidebar: false
};