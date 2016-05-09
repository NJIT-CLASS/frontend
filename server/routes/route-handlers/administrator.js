const async = require('async');

function getInstructorEmails(req, instructor, cb) {
    req.App.api.get(`/generalUser/${instructor.UserID}`, (err, statusCode, body) => {
        cb(null, {
            email: body.User[0].Email,
            userId: instructor.UserID,
            admin: instructor.Admin
        });
    });
}

exports.get = (req, res) => {
    req.App.api.get('/instructor/all', (err, statusCode, body) => {
        async.map(body.Instructors, getInstructorEmails.bind(null, req), (err, results) => {
            res.render('admin', {
                instructors: results
            });
        });
    });
};

exports.post = (req, res) => {
    if (!req.body.email) {
        return res.redirect(req.route.path);
    }
    req.App.api.put('/instructor/new', {email: req.body.email}, (err, statusCode, body) => {
        return res.redirect(req.route.path);
    });
}