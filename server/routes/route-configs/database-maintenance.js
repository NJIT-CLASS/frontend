const handler = require('../route-handlers/database-maintenance');

module.exports = {
    route: '/database-manage',
    title: 'Database Maintenance',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        loggedOut: false
    },
    icon: 'database',
    sidebar: true
};
