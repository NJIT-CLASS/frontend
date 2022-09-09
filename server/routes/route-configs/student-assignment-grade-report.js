const handler = require('../route-handlers/student-assignment-grade-report');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/student-assignment-grade-report/all/:assignmentId',
    title: 'Student Grade Report',
    routeHandler: handler,
    access: {
        admins: false,
        instructors: false,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'address-book',
    sidebar: true
};
