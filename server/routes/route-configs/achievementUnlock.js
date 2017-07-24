/**
 * Created by Sohail on 7/16/2017.
 */
const handler = require('../route-handlers/achievementUnlock');

module.exports = {
    route: '/achievementUnlock',
    title: 'Achievement Unlock',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'unlock-alt',
    sidebar: true
};
