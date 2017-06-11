/* maintained by gulp:create-route. Do not change how this works without checking that script */
const pages = [
    'login',
    'logout',
    'dashboard',
    'my-account',
    'course-section-management',
    'badges',
    'leaderboard',
    'create-assignment',
    'assignment-editor',
    'administrator',
    'add-user',
    'settings',
    'account',
    'translation-manager',
    'about',
    'reset-password',
    'confirm-password-reset',
    'course-page',
    'masquerade',
    'stop-masquerading',
    'task-template',
    'assign-to-section',
    'testing-ground',
    'task-status-table',
    'onboarding',
    'initial-password-change',
];

var pageConfigs = [];

for(var page of pages) {
    pageConfigs.push(require(`./route-configs/${page}`));
}

module.exports = pageConfigs;
