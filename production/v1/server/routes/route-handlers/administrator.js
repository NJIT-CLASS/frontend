'use strict';

var async = require('async');

function getInstructorEmails(req, instructor, cb) {
    req.App.api.get('/generalUser/' + instructor.UserID, function (err, statusCode, body) {
        cb(null, {
            email: body.User.UserLogin.Email,
            userId: instructor.UserID,
            admin: instructor.Admin
        });
    });
}

exports.get = function (req, res) {
    if (req.App.user === undefined) {
        res.redirect('/');
    }
    req.App.api.get('/instructor/all', function (err, statusCode, body) {
        async.map(body.Instructors, getInstructorEmails.bind(null, req), function (err, results) {
            res.render('admin', {
                instructors: results
            });
        });
    });
};

exports.post = function (req, res) {
    if (!req.body.email) {
        return res.redirect(req.route.path);
    }
    req.App.api.put('/instructor/new', { email: req.body.email }, function (err, statusCode, body) {
        return res.redirect(req.route.path);
    });
};