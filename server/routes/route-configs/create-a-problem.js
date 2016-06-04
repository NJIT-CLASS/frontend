const consts = require('../../utils/constants');
const handler = require('../route-handlers/create-a-problem');

module.exports = {
    route: '/task/'+ consts.TASK_TYPES.CREATE_PROBLEM +'/:taskId',
    title: 'Create a Problem',
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
