const handler = require('../route-handlers/masquerade');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/masquerade',
    title: 'Masquerade',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        role: ROLES.ADMIN,
        loggedOut: false
    },
    icon: '',
    sidebar: false
};
