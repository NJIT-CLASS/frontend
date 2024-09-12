const handler = require('../route-handlers/dashboard');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/dashboard',
    title: 'Dashboard',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'home',
    sidebar: true
};
