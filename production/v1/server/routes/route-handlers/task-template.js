'use strict';

var _react_constants = require('../../utils/react_constants');

exports.get = function (req, res) {

    if (req.App.user === undefined) {
        return res.redirect('/?url=' + encodeURIComponent(req.originalUrl));
    }
    res.render('task-template', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        taskId: req.params.taskId,
        courseId: req.query.courseId,
        sectionId: req.query.sectionId,
        apiUrl: _react_constants.API_URL
    });
};