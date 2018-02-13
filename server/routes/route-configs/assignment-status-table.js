const handler = require('../route-handlers/assignment-status-table');

module.exports = {
    route: '/assignment-status',
    title: 'Assignment Status Table',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'align-left',
    sidebar: true
};
