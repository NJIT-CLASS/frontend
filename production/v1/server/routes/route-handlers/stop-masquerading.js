'use strict';

exports.get = function (req, res) {
    req.session.userId = req.session.masqueraderId;
    req.session.masqueraderId = null;
    res.redirect('/');
};