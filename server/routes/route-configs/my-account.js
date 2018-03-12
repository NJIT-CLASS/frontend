const handler = require('../route-handlers/my-account');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/my-account',
    title: 'My Account',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.GUEST,
        loggedOut: false
    },
    icon: 'cog',
    sidebar: false
};
