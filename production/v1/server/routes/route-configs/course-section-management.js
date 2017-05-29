'use strict';

var handler = require('../route-handlers/course-section-management');

module.exports = {
    route: '/course-section-management',
    title: 'Course Management',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'pencil-square',
    sidebar: true
};