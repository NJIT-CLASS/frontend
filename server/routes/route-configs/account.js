const handler = require('../route-handlers/account');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/account',
    title: 'Account',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.GUEST,
        loggedOut: false
    },
    icon: 'user',
    sidebar: true
};
