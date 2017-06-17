const handler = require('../route-handlers/volunteer-pool');

module.exports = {
    route: '/volunteer-pool',
    title: 'Volunteer Pool',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: '',
    sidebar: true
};
