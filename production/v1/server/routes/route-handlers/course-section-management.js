'use strict';

var _react_constants = require('../../utils/react_constants');

exports.get = function (req, res) {

    if (req.App.user === undefined) {
        return res.redirect('/');
    }
    res.render('course-section-management', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        apiUrl: _react_constants.API_URL
    });
};