'use strict';

exports.get = function (req, res) {
    res.render('comment', {
        title: 'Comment',
        pageHeader: 'Comment'
    });
};