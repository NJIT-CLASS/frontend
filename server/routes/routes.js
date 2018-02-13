/* maintained by gulp:create-route. Do not change how this works without checking that script */
const pages = [
    'login',
    'logout',
    'dashboard',
    'my-account',
    'course-section-management',
    'create-assignment',
    'assignment-editor',
    'administrator',
    'add-user',
    'settings',
    'account',
    'translation-manager',
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
    'assignment-final-grades',
    'volunteer-pool',
    'section',
    'user-management',
    'everyones-work',
    'reallocation',
    'about',
    'section',
    'assignment-status-table',
    'database-maintenance'
];

var pageConfigs = [];

for(var page of pages) {
    pageConfigs.push(require(`./route-configs/${page}`));
}

module.exports = pageConfigs;
