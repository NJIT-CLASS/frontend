const handler = require('../route-handlers/reallocation.js');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/reallocation',
    title: 'Reallocations',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.ADMIN,
        loggedOut: false
    },
    icon: 'exchange',
    sidebar: false
};