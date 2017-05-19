/* maintained by gulp:create-route. Do not change how this works without checking that script */
const pages = [
    'login',
    'logout',
    'dashboard',
    'my-account',
    'create-course',
    'add-section',
    'create-assignment',
    'course-section-management',
    'administrator',
    'add-user',
    'settings',
    'account',
    'translation-manager',
    'about',
    'reset-password',
    'confirm-password-reset',
    'course-page',
    'create-account',
    'comment',
    'masquerade',
    'stop-masquerading',
    'task-template',
    'assignment-editor',
    'assign-to-section',
    'course-assignments',
    'testing-ground',
    //'all-users',
    'task-status-table',
    'onboarding'
];

var pageConfigs = [];

for(var page of pages) {
    pageConfigs.push(require(`./route-configs/${page}`));
}

module.exports = pageConfigs;
