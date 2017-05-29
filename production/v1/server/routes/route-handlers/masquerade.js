'use strict';

var _ = require('lodash');

exports.get = function (req, res) {
    res.render('masquerade');
};

exports.post = function (req, res) {
    if (req.body.email === '') {
        return res.render('masquerade', {
            Error: true
        });
    }

    var email = req.body.email;
    req.App.api.get('/getUserId/' + email, function (err, statusCode, body) {
        if (body.UserID !== -1) {
            var currentUserId = req.session.userId;
            req.session.userId = body.UserID;
            req.session.masqueraderId = currentUserId;
            return res.redirect('/');
        } else {
            return res.render('masquerade', {
                Error: true
            });
        }
    });
};