const handler = require('../route-handlers/course-page');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/course_page/:Id',
    title: 'Course Page',
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
