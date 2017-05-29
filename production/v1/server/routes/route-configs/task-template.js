'use strict';

var handler = require('../route-handlers/task-template');

module.exports = {
    route: '/task/:taskId',
    title: 'Task Page',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'fa-pencil',
    sidebar: false
};