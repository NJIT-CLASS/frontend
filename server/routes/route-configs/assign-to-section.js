const handler = require('../route-handlers/assign-to-section');

module.exports = {
    route: '/assign-to-section/:userId',
    title: 'Assign to Section',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'fa-pencil',
    sidebar: false
};
