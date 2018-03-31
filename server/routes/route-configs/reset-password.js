const handler = require('../route-handlers/reset-password');

module.exports = {
    route: '/reset-password',
    title: 'Reset Password',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: null,
        loggedOut: true
    },
    icon: '',
    sidebar: false
};
