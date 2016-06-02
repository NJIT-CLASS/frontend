const handler = require('../route-handlers/solve-the-problem');

module.exports = {
    route: '/task/solve/:taskId',
    title: 'Solve the Problem',
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
