const consts = require('../../utils/constants');
const handler = require('../route-handlers/grade-the-response');

module.exports = {
    route: '/task/' + consts.TASK_TYPES.GRADE_PROBLEM + '/:taskId',
    title: 'Grade the Response',
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
