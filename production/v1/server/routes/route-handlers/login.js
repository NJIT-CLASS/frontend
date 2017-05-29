'use strict';

exports.get = function (req, res) {
    if (req.App.user && req.App.user.userId) {
        return res.redirect('/dashboard');
    }

    if ('masqueraderId' in req.session) {
        delete req.session.masqueraderId;
    }

    req.App.api.get('/initial', function (err, statusCode, body) {
        if (statusCode == 400) {
            return res.redirect('/onboarding');
        }

        return res.render('home', {
            returnUrl: req.query.url
        });
    });
};

exports.post = function (req, res) {

    req.App.api.post('/login', { emailaddress: req.body.email, password: req.body.password }, function (err, statusCode, body) {

        switch (statusCode) {
            case 500:
                return res.render('home', {
                    serverError: true,
                    returnUrl: req.body.url
                });
            case 201:
            case 200:
                req.session.userId = body.UserID;
                req.session.token = body.Token;
                // THIS WILL REDIRECT TO SETTINGS IF THE USER IS NEWLY ADDED.
                if (body.Pending === true) {
                    return res.redirect('/initial-password-change');
                } else {
                    return res.redirect(req.body.url || '/');
                }
            case 401:
                if (!body) {
                    if (body.Timeout) {
                        return res.render('home', {
                            credentialsError: true,
                            timeout: body.Timeout,
                            returnUrl: req.body.url
                        });
                    }
                    return res.render('home', {
                        credentialsError: true,
                        returnUrl: req.body.url
                    });
                } else {
                    return res.render('home', {
                        credentialsError: true,
                        returnUrl: req.body.url
                    });
                }

            default:
                return res.send('Broked :\'(');
        }
    });
};