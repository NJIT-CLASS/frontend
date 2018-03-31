const handler = require('../route-handlers/settings');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/settings',
    title: 'Settings',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'cogs',
    sidebar: false
};
