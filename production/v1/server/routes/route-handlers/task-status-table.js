'use strict';

var _react_constants = require('../../utils/react_constants');

exports.get = function (req, res) {
    res.render('./task-status-table', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        assignmentId: req.params.assignmentId,
        apiUrl: _react_constants.API_URL
    });
};