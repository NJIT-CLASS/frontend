'use strict';

var handler = require('../route-handlers/onboarding');

module.exports = {
    route: '/onboarding',
    title: 'Initial Setup',
    routeHandler: handler,
    access: {
        admins: false,
        instructors: false,
        students: false,
        loggedOut: true
    },
    icon: 'files-o',
    sidebar: false
};