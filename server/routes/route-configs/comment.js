const handler = require('../route-handlers/comment');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/comment',
    title: 'Comment',
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
