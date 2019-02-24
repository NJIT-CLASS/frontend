const handler = require('../route-handlers/everyones-work');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/everyones-work/:assignmentId?',
    title: 'Everyone\'s Work' ,
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.PARTICIPANT,
        loggedOut: false
    },
    icon: 'users',
    sidebar: true
};
