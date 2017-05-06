const consts = require('../../utils/constants');

exports.get = (req, res) => {

    if(req.App.user === undefined){
        return res.redirect('/');
    }
    res.render('course-section-management', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        apiUrl: consts.API_URL
    });
};
