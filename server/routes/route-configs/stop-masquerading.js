const handler = require('../route-handlers/stop-masquerading');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/stop-masquerading',
    title: 'Stop Masquerading',
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
