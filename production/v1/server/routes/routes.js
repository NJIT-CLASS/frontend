'use strict';

/* maintained by gulp:create-route. Do not change how this works without checking that script */
var pages = ['login', 'logout', 'dashboard', 'my-account', 'course-section-management', 'create-assignment', 'assignment-editor', 'administrator', 'add-user', 'settings', 'account', 'translation-manager', 'about', 'reset-password', 'confirm-password-reset', 'course-page', 'masquerade', 'stop-masquerading', 'task-template', 'assign-to-section', 'testing-ground', 'task-status-table', 'onboarding', 'initial-password-change'];

var pageConfigs = [];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = pages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var page = _step.value;

        pageConfigs.push(require('./route-configs/' + page));
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

module.exports = pageConfigs;