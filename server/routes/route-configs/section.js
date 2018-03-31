const handler = require('../route-handlers/section');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/section/:sectionId',
    title: 'Section',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: '',
    sidebar: false
};
