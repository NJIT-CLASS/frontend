const handler = require('../route-handlers/assignment-final-grades');

module.exports = {
    route: '/assignment-grade-report/all/:assignmentId',
    title: 'Grade Report',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'address-book',
    sidebar: true
};
