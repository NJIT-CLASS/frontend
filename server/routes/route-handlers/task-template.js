import {ROLES} from '../../utils/react_constants';

exports.get = (req, res) => {

    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }

    var userIDToUse = req.App.user.userId;
    if(req.session.masqueraderId != null && req.session.masqueraderId != undefined){
        userIDToUse = req.session.masqueraderId;
    }
    res.render('task-template', {
        scripts: ['/static/react_apps.js'],
        userId: userIDToUse ,
        taskId: req.params.taskId,
        courseId: req.query.courseId,
        sectionId: req.query.sectionId,
        userType: req.App.user.role,
        isAdmin: req.App.user.role === ROLES.ENHANCED,
        visitorId: req.query.visitorId,
    });
};
