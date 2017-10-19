
exports.get = (req, res) => {

    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    res.render('task-template', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        taskId: req.params.taskId,
        courseId: req.query.courseId,
        sectionId: req.query.sectionId,
        userType: req.App.user.type,
        isAdmin: req.App.user.admin,
        visitorId: req.query.visitorId,
    });
};
