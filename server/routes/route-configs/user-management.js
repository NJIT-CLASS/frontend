const handler = require('../route-handlers/user-management');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/user-management',
    title: 'User Management',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        role: ROLES.ADMIN,
        loggedOut: false
    },
    icon: 'cogs',
    sidebar: true
};
