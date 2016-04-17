const handler = require('../route-handlers/completed-task');

module.exports = {
    route: '/task',
    title: 'Completed Task',
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
