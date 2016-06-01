const handler = require('../route-handlers/edit-the-problem');

module.exports = {
    route: '/task/edit/:taskId',
    title: 'Edit the Problem',
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
