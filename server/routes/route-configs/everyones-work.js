const handler = require('../route-handlers/everyones-work');

module.exports = {
    route: '/everyones-work/:assignmentId?',
    title: 'Everyone\'s Work' ,
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'tasks',
    sidebar: true
};
