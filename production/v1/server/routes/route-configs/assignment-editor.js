'use strict';

var handler = require('../route-handlers/assignment-editor');

module.exports = {
    route: '/asa/:courseId', //will also need userId
    title: 'Assignment Editor',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'file-text',
    sidebar: false
};