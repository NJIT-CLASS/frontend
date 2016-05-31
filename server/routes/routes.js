/* maintained by gulp:create-route. Do not change how this works without checking that script */
const pages = [
    'login',
    'logout',
    'dashboard',
    'my-account',
    'create-course',
    'create-assignment',
    'administrator',
    'translation-manager',
    'about',
    'reset-password',
    'confirm-password-reset',
    'course-page',
    'create-account',
    'completed-task',
    'create-problem',
    'solve-problem',
    'edit-problem',
    'comment',
    'grade-problem',
    'revise-and-edit',
    'masquerade',
    'stop-masquerading',    'task-template'
];

var pageConfigs = [];

for(var page of pages) {
    pageConfigs.push(require(`./route-configs/${page}`));
}

module.exports = pageConfigs;
