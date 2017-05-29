'use strict';

var handler = require('../route-handlers/course-page');

module.exports = {
    route: '/course_page/:Id',
    title: 'Course Page',
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