'use strict';

var _react_constants = require('../../utils/react_constants');

exports.get = function (req, res) {
    if (req.App.user === undefined) {
        res.redirect('/');
    }
    res.render('./assign-to-section', {
        scripts: ['/static/react_apps.js'],
        assignmentId: req.params.assignmentId,
        courseId: req.query.courseId,
        userId: req.App.user.userId,
        apiUrl: _react_constants.API_URL
    });
};