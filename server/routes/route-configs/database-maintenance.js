const handler = require('../route-handlers/database-maintenance');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/database-manage',
    title: 'Database Maintenance',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        role: ROLES.ADMIN,
        loggedOut: false
    },
    icon: 'archive',
    sidebar: true
};
