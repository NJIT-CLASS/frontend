const handler = require('../route-handlers/assignments-page');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/assignments_page',
    title: 'Assignments Status',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'paper',
    sidebar: true
};  