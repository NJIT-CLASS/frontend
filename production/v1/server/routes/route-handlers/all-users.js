'use strict';

var _react_constants = require('../../utils/react_constants');

exports.get = function (req, res) {
    res.render('all-users', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        apiUrl: _react_constants.API_URL
    });
};