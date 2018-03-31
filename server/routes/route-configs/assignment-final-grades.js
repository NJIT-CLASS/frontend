const handler = require('../route-handlers/assignment-final-grades');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/assignment-grade-report/all/:assignmentId',
    title: 'Grade Report',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'address-book',
    sidebar: true
};
