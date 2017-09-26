const handler = require('../route-handlers/game-settings');

module.exports = {
    route: '/game-settings',
    title: 'Game Settings',
    routeHandler: handler,
    access: {
        admins: true,
        instructors: true,
        students: false,
        loggedOut: false
    },
    icon: 'cogs',
    sidebar: true
};
