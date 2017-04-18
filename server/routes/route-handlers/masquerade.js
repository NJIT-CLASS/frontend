const _ = require('lodash');

exports.get = (req, res) => {
    res.render('masquerade');
};

exports.post = (req, res) => {
    const email = req.body.email;
    req.App.api.get(`/getUserId/${email}`, (err, statusCode, body) => {
        if (body.UserID !== -1) {
            const currentUserId = req.session.userId;
            req.session.userId = body.UserID;
            req.session.masqueraderId = currentUserId;
            res.redirect('/');
        }
        else {
            res.render('masquerade', {
                Error: true
            });
        }
    });
};
