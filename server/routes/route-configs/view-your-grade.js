const handler = require('../route-handlers/view-your-grade');

module.exports = {
    route: '/task/graded/:taskId',
    title: 'View Your Grade',
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
