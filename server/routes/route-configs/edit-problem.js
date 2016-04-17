const handler = require('../route-handlers/edit-problem');

module.exports = {
    route: '/editproblem',
    title: 'Edit Problem',
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
