const handler = require('../route-handlers/account');

module.exports = {
    route: '/account',
    title: 'Account',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'pencil-square',
    sidebar: true
};
