const handler = require('../route-handlers/assignment-editor');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/asa/:courseId', //will also need userId
    title: 'Assignment Editor',
    sidebarLink: '/asa/*',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        role: ROLES.TEACHER,
        loggedOut: false
    },
    icon: 'file-text',
    sidebar: true
};
