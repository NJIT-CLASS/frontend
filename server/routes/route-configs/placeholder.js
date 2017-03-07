const handler = require('../route-handlers/placeholder');

module.exports = {
    route: '/create-course-section',
    title: 'Placeholder',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: '',
    sidebar: true
};
