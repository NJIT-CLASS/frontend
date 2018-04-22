const handler = require('../route-handlers/administrator');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/administrator',
    title: 'Administrator',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        roles: ROLES.ADMIN,
        loggedOut: false
    },
    icon: 'cogs',
    sidebar: true
};
