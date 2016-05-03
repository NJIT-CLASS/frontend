exports.get = (req, res) => {
    req.App.api.get('/instructor/all', (err, statusCode, body) => {
        res.render('admin', {
            instructors: body.Instructors
        });
    });
};