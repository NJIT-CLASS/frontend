const handler = require('../route-handlers/solve-problem');

module.exports = {
    route: '/solveproblem',
    title: 'Solve Problem',
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
