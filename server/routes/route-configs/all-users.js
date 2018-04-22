const handler = require('../route-handlers/all-users');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/all-users',
    title: 'All Users',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        role: ROLES.ADMIN,
        loggedOut: false
    },
    icon: 'users',
    sidebar: true
};
