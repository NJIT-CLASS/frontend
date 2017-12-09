const handler = require('../route-handlers/section');

module.exports = {
    route: '/section/:sectionId',
    title: 'Section',
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
