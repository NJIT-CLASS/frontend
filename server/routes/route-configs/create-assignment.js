const handler = require('../route-handlers/create-assignment');

module.exports = {
    route: '/create-assignment',
    title: 'Create Assignment',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'file-text',
    sidebar: true
};
