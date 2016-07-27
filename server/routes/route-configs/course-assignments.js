const handler = require('../route-handlers/course-assignments');

module.exports = {
    route: '/course-assignments/:courseId',
    title: 'Course Assignments',
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
