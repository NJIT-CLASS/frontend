import {API_URL} from '../../utils/react_constants';

exports.get = (req, res) => {

    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    res.render('task-template', {
        scripts: ['/static/react_apps.js'],
        showHeader: false,
        userId: req.App.user.userId,
        taskId: req.params.taskId,
        courseId: req.query.courseId,
        sectionId: req.query.sectionId,
        userType: req.App.user.type,
        isAdmin: req.App.user.admin,
        apiUrl: API_URL
    });
};
