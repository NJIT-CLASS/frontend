const handler = require('../route-handlers/login');

module.exports = {
    route: '/',
    title: 'Login',
    routeHandler: handler,
    access: {
        admins: false,
        instructors: false,
        students: false,
        role: null,
        loggedOut: true
    },
    sidebar: false
};
