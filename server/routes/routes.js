/* maintained by gulp:create-route. Do not change how this works without checking that script */
const pages = [
    'login',
    'logout',
    'dashboard',
    'assignments-page',
    'everyones-work',
    'assignment-final-grades',

    'account',
    'about',
    'course-section-management',
    'assignment-editor',
    'user-management',
    'create-assignment',
    'translation-manager',
    'database-maintenance',

    //'administrator',
    'add-user',
    'settings',
    'my-account',
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
    'volunteer-pool',
    'section',
    'reallocation',
    'section',
    //'assignment-status-table',


];

var pageConfigs = [];

for(var page of pages) {
    pageConfigs.push(require(`./route-configs/${page}`));
}

module.exports = pageConfigs;
