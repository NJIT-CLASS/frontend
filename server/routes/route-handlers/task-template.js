const consts = require('../../utils/constants');
exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('task-template', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        taskId: req.params.taskId,
        courseId: req.query.courseId,
        sectionId: req.query.sectionId,
        apiUrl: consts.API_URL
    });
};
