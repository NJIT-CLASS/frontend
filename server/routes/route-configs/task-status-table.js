const handler = require('../route-handlers/task-status-table');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/assignment-record/:assignmentId',
    title: 'Assignment Status',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.TEACHER,
        loggedOut: false
    },
    icon: 'bar-chart',
    sidebar: false
};
