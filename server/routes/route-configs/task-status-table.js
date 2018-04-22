const handler = require('../route-handlers/task-status-table');

module.exports = {
    route: '/assignment-record/:assignmentId',
    title: 'Assignment Status',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'bar-chart',
    sidebar: false
};
