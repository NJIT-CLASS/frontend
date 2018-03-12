const handler = require('../route-handlers/assign-to-section');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/assign-to-section/:assignmentId',
    title: 'Assign to Section',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.TEACHER,
        loggedOut: false
    },
    icon: 'fa-pencil',
    sidebar: false
};
