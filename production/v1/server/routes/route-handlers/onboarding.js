'use strict';

exports.get = function (req, res) {
    req.App.api.get('/initial', function (err, statusCode, body) {
        if (statusCode === 400) {
            return res.render('onboarding');
        }
        return res.status(404).end();
    });
};

exports.post = function (req, res) {
    var _req$body = req.body,
        firstname = _req$body.firstname,
        lastname = _req$body.lastname,
        email = _req$body.email,
        password = _req$body.password,
        confirmpassword = _req$body.confirmpassword;

    firstname = firstname.replace(/\s/g, '');
    lastname = lastname.replace(/\s/g, '');
    email = email.replace(/\s/g, '');

    if (firstname === '' || lastname === '' || email === '' || password === '' || confirmpassword === '') {
        return res.render('onboarding', {
            fieldsMissing: true
        });
    } else if (password !== confirmpassword) {
        return res.render('onboarding', {
            mismatchPassword: true
        });
    }

    req.App.api.get('/initial', function (err, statusCode, body) {
        if (statusCode !== 400) {
            return res.status(404).end();;
        }

        req.App.api.post('/adduser', {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            instructor: true,
            admin: true,
            trustpassword: true
        }, function (err, statusCode, body) {
            switch (statusCode) {
                case 400:
                    //missing field
                    return res.render('onboarding', {
                        fieldsMissing: true
                    });
                case 500:
                    //server error
                    return res.render('onboarding', {
                        serverError: true
                    });
                default:
                    //success
                    return res.redirect('/');
            }
        });
    });
};