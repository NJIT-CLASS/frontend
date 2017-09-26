const handler = require('../route-handlers/reallocation.js');

module.exports = {
    route: '/reallocation',
    title: 'Reallocations',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: '',
    sidebar: false
}