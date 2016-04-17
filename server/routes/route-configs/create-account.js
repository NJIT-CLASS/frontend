const handler = require('../route-handlers/create-account');

module.exports = {
    route: '/create-account/:id',
    title: 'Create Account',
    routeHandler: handler,
    access: {
        admins: undefined,
        instructors: undefined,
        students: undefined,
        loggedOut: true
    },
    icon: '',
    sidebar: false
};
