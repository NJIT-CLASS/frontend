const consts = require('../../utils/constants');
exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }

    res.render('./asa', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        courseId: req.params.courseId,
        apiUrl: consts.API_URL
    });
};
