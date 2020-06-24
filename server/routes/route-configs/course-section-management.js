const handler = require('../route-handlers/course-section-management');
import {ROLES} from '../../utils/react_constants';


module.exports = {
    route: '/course-section-management',
    title: 'Course Management',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.TEACHER,
        loggedOut: false
    },
    icon: 'sitemap',
    sidebar: true
};
