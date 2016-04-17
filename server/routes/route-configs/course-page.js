const handler = require('../route-handlers/course-page');

module.exports = {
    route: '/course_page/:Id',
    title: 'Course Page',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: '',
    sidebar: false
};
