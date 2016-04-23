const handler = require('../route-handlers/grade-problem');

module.exports = {
    route: '/grade',
    title: 'Grade Problem',
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
