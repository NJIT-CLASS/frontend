const handler = require('../route-handlers/task-template');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/task/:taskId',
    title: 'Task Page',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'fa-pencil',
    sidebar: false
};
