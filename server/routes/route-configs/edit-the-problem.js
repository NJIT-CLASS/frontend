const consts = require('../../utils/constants');
const handler = require('../route-handlers/edit-the-problem');

module.exports = {
    route: '/task/' + consts.TASK_TYPES.EDIT + '/:taskId',
    title: 'Edit the Problem',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'fa-pencil',
    sidebar: false
};
