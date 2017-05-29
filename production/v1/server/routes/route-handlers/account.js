'use strict';

var _react_constants = require('../../utils/react_constants');

exports.get = function (req, res) {
    if (req.App.user === undefined) {
        res.redirect('/');
    }
    res.render('account', {
        scripts: ['/static/react_apps.js', '/static/vendor/zxcvbn.min.js'],
        userId: req.App.user.userId,
        apiUrl: _react_constants.API_URL
    });
};