const handler = require('../route-handlers/create-account');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/create-account/:id',
    title: 'Create Account',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: true
    },
    icon: '',
    sidebar: false
};
