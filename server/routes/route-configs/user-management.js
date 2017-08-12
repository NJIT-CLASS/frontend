const handler = require('../route-handlers/user-management');

module.exports = {
    route: '/user-management',
    title: 'User Management',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        loggedOut: false
    },
    icon: 'cogs',
    sidebar: false
};
