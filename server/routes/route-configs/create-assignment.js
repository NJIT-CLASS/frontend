const handler = require('../route-handlers/create-assignment');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/create-assignment',
    title: 'Create Assignment',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.TEACHER,
        loggedOut: false
    },
    icon: 'file-text',
    sidebar: false
};
