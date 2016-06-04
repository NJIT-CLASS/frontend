const consts = require('../../utils/constants');
const handler = require('../route-handlers/resolve-the-dispute');

module.exports = {
    route: '/task/' + consts.TASK_TYPES.RESOLVE_DISPUTE + '/:taskId',
    title: 'Resolve the Dispute',
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
