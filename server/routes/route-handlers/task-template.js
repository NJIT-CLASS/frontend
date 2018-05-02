import {ROLES} from '../../utils/react_constants';

exports.get = (req, res) => {

    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    res.render('task-template', {
        scripts: ['/static/react_apps.js'],
        userId: req.session.masqueraderId || req.App.user.userId,
        taskId: req.params.taskId,
        courseId: req.query.courseId,
        sectionId: req.query.sectionId,
        userType: req.App.user.role,
        isAdmin: req.App.user.role === ROLES.ENHANCED,
        visitorId: req.query.visitorId,
    });
};
