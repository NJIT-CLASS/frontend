const handler = require('../route-handlers/revise-and-edit');

module.exports = {
    route: '/revise',
    title: 'Revise and Edit',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: '',
    sidebar: false
};
