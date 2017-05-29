'use strict';

exports.get = function (req, res) {
    if (req.App.user === undefined) {
        return res.redirect('/');
    }
    res.render('about');
};