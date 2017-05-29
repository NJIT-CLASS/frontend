'use strict';

var handler = require('../route-handlers/comment');

module.exports = {
    route: '/comment',
    title: 'Comment',
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