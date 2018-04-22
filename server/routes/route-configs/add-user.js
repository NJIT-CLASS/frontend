const handler = require('../route-handlers/add-user');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/add-user',
    title: 'Add User',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        roles: ROLES.ADMIN,
        loggedOut: false

    },
    icon: 'user-plus',
    sidebar: true
};
