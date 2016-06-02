const handler = require('../route-handlers/grade-the-response');

module.exports = {
    route: '/task/grade/:taskId',
    title: 'Grade the Response',
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
