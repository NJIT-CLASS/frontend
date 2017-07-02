/**
 * Created by Sohail and Immanuel on 6/11/2017.
 */

const handler = require('../route-handlers/leaderboard');

module.exports = {
    route: '/leaderboard',
    title: 'Leaderboard',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: true,
        loggedOut: false
    },
    icon: 'group',
    sidebar: true
};
