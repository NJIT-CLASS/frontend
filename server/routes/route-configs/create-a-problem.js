const handler = require('../route-handlers/create-a-problem');

module.exports = {
    route: '/task/create/:taskId',
    title: 'Create a Problem',
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
