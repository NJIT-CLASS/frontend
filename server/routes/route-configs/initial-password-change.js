import {ROLES} from '../../utils/react_constants';
const handler = require('../route-handlers/initial-password-change');

module.exports = {
    route: '/initial-password-change',
    title: 'Login',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.GUEST,
        loggedOut: false
    },
    sidebar: false
};
