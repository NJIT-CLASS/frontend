const consts = require('../../utils/constants');

exports.get = (req, res) => {
    res.render('create_course', {
        title: 'Create Course',
        pageHeader: 'Create Course',
        scripts: ['/static/create_course.js'],
        userId: req.App.user.userId,
        apiUrl: consts.API_URL
    });
};
