const consts = require('../../utils/constants');
const handler = require('../route-handlers/completed-task');

module.exports = {
    route:  '/task/'+ consts.TASK_TYPES.COMPLETED +'/:taskId',
    title: 'Completed Task',
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
