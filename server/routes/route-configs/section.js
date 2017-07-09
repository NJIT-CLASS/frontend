const handler = require('../route-handlers/section');

module.exports = {
    route: '/sections',
    title: 'Sections',
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
