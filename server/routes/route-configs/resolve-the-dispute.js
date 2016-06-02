const handler = require('../route-handlers/resolve-the-dispute');

module.exports = {
    route: '/task/resolve/:taskId',
    title: 'Resolve the Dispute',
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
