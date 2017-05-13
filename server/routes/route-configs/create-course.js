const handler = require('../route-handlers/create-course');

module.exports = {
    route: '/create-course',
    title: 'Create Course',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'plus',
    sidebar: false
};
