/**
 * Created by Sohail on 6/6/2017.
 */
const handler = require('../route-handlers/badges');

module.exports = {
    route: '/badges',
    title: 'Badges',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'trophy',
    sidebar: true
};
