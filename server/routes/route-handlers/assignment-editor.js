const consts = require('../../utils/constants');
exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }

    res.render('./asa', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        courseId: req.params.courseId,
        partialAssignmentId: req.query.partialAssignmentId,
        assignmentId: req.query.assignmentId,
        apiUrl: consts.API_URL
    });
};
