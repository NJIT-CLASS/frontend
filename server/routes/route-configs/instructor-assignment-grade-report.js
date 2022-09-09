const handler = require('../route-handlers/instructor-assignment-grade-report');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/instructor-assignment-grade-report/all/:assignmentId',
    title: 'Instructor Grade Report',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.TEACHER,
        loggedOut: false
    },
    icon: 'address-book',
    sidebar: true
};
