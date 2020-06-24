const handler = require('../route-handlers/about');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/about-loggedout',
    title: 'About Participatory Learning',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        role: ROLES.GUEST,
        loggedOut: true
    },
    icon: 'info-circle',
    sidebar: false
};
 