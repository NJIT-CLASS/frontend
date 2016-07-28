const consts = require('../../utils/constants');
const handler = require('../route-handlers/dispute-your-grade');

module.exports = {
    route: '/task/' + consts.TASK_TYPES.DISPUTE + '/:taskId',
    title: 'Dispute Your Grade',
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
