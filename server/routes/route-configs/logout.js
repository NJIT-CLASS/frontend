const handler = require('../route-handlers/logout');

module.exports = {
    route: '/logout',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: null,
        loggedOut: true
    },
    sidebar: false
};
