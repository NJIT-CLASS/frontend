const _ = require('lodash');

exports.get = (req, res) => {
    res.render('masquerade');
};

exports.post = (req, res) => {
    if(req.body.email === ''){
        return res.render('masquerade', {
            Error: true
        });
    }

    const email = req.body.email;

    req.App.api.post('/getUserId',{email:email},(err, statusCode, body) => {
        if (body.UserID !== null) {
            const currentUserId = req.session.userId;
            req.session.userId = body.UserID;
            req.session.masqueraderId = currentUserId;
            return res.redirect('/');
        }
        else {
            return res.render('masquerade', {
                Error: true
            });
        }
    });
};
