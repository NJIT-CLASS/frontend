const handler = require('../route-handlers/task-template');

module.exports = {
    route: '/task/:taskId',
    title: 'Task Template',
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
