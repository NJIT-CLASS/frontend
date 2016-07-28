const consts = require('../../utils/constants');
const handler = require('../route-handlers/consolidate-the-grades');

module.exports = {
    route: '/task/'+ consts.TASK_TYPES.CONSOLIDATION +'/:taskId',
    title: 'Consolidate the Grades',
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
