const handler = require('../route-handlers/assignments-page');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/assignments_page',
    title: 'All Assignments\' Status',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'list',
    sidebar: true
};  