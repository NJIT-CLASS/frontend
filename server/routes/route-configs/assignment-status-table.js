const handler = require('../route-handlers/assignment-status-table');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/assignment-status',
    title: 'Assignment Status Table',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'align-left',
    sidebar: true
};
