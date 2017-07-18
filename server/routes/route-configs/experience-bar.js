/**
 * Created by Sohail on 7/16/2017.
 */
const handler = require('../route-handlers/experience-bar');

module.exports = {
    route: '/experience-bar',
    title: 'Experience Bar',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'window-minimize',
    sidebar: true
};
