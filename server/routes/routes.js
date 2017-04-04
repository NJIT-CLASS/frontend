/* maintained by gulp:create-route. Do not change how this works without checking that script */
const pages = [
    'login',
    'logout',
    'dashboard',
    'my-account',
    'create-course',
    'add-section',
    'create-assignment',
    'administrator',
    'add-user',
    'settings',
    'translation-manager',
    'about',
    'reset-password',
    'confirm-password-reset',
    'course-page',
    'create-account',
    'create-problem',
    'solve-problem',
    'edit-problem',
    'comment',
    'grade-problem',
    'revise-and-edit',
    'masquerade',
    'stop-masquerading',
    'task-template',
    'create-a-problem',
    'edit-the-problem',
    'solve-the-problem',
    'grade-the-response',
    'dispute-your-grade',
    'resolve-the-dispute',
    'view-your-grade',
    'completed-task',
    'consolidate-the-grades',
    'assignment-editor',
    'assign-to-section',
    'course-assignments',
    'testing-ground',
    //'all-users',
    'task-status-table',
    'placeholder'
];

var pageConfigs = [];

for(var page of pages) {
    pageConfigs.push(require(`./route-configs/${page}`));
}

module.exports = pageConfigs;
