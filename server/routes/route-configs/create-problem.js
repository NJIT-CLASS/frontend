const handler = require('../route-handlers/create-problem');

module.exports = {
    route: '/createproblem',
    title: 'Create Problem',
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
