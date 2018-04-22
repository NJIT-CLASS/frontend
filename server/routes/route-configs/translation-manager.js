const handler = require('../route-handlers/translation-manager');
import {ROLES} from '../../utils/react_constants';

module.exports = {
    route: '/translation-manager',
    title: 'Translation Manager',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: false,
        students: false,
        role: ROLES.ADMIN,
        loggedOut: false
    },
    icon: 'globe',
    sidebar: true
};
