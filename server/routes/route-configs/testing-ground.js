const handler = require('../route-handlers/testing-ground');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/testing',
    title: 'Testing Ground',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        role: ROLES.ENHANCED,
        loggedOut: false
    },
    icon: 'cog',
    sidebar: false
};
