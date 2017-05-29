'use strict';

var _react_constants = require('../../utils/react_constants');

exports.get = function (req, res) {
    if (req.App.user === undefined) {
        res.redirect('/');
    }
    res.render('add-user', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        userType: req.App.user.type,
        apiUrl: _react_constants.API_URL
    });
};