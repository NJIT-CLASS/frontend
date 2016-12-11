const handler = require('../route-handlers/add-section');

module.exports = {
    route: '/add-section',
    title: 'Add Section',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'plus-square',
    sidebar: true
};
