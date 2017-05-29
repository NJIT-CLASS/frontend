'use strict';

exports.get = function (req, res) {

    //make call to check if user is actually Pending
    if (req.App.user === undefined) {
        return res.redirect('/');
    }
    req.App.api.get('/user/pendingStatus/' + req.App.user.userId, function (err, statusCode, body) {
        if (statusCode === 401) {
            return res.status(404).end();
        } else {
            return res.render('initial-password-change');
        }
    });
};

exports.post = function (req, res) {
    var _req$body = req.body,
        currentpassword = _req$body.currentpassword,
        newpassword = _req$body.newpassword,
        confirmpassword = _req$body.confirmpassword;


    req.App.api.get('/user/pendingStatus/' + req.App.user.userId, function (err, statusCode, body) {
        if (statusCode === 401) {
            return res.status(404).end();
        }

        if (currentpassword === '' || newpassword === '' || confirmpassword === '') {
            return res.render('initial-password-change', {
                fieldsMissing: true
            });
        } else if (newpassword !== confirmpassword) {
            return res.render('initial-password-change', {
                mismatchPassword: true
            });
        }

        req.App.api.post('/update/password', {
            userId: req.App.user.userId,
            oldPasswd: currentpassword,
            newPasswd: newpassword
        }, function (err, statusCode, body) {
            if (err || statusCode === 401) {
                return res.render('initial-password-change', {
                    serverError: true
                });
            } else {
                return res.redirect('/');
            }
        });
    });
};