'use strict';

exports.get = function (req, res) {
    res.render('testing', {
        scripts: ['/static/react_apps.js']
    });
};