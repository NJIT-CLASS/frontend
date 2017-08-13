const handler = require('../route-handlers/account');

module.exports = {
    route: '/account',
    title: 'My Profile',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'user',
    sidebar: true
};
