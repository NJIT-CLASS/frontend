const handler = require('../route-handlers/dispute-your-grade');

module.exports = {
    route: '/task/dispute/:taskId',
    title: 'Dispute Your Grade',
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
