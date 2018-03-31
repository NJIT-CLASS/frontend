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
        role: ROLES.TEACHER,
        loggedOut: false
    },
    icon: 'exchange',
    sidebar: true
};