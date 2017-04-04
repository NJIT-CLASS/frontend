const handler = require('../route-handlers/placeholder');

module.exports = {
    route: '/create-course-section',
    title: 'Course Management',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'pencil-square',
    sidebar: true
};
