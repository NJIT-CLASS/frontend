const handler = require('../route-handlers/confirm-password-reset');

module.exports = {
    route: '/confirm-password-reset',
    title: 'Confirm Password Reset',
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
