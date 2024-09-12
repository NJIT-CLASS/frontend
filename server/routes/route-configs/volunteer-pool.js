const handler = require('../route-handlers/volunteer-pool');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/volunteer-pool',
    title: 'Volunteer Pool',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'hand-paper',
    sidebar: false
};
