import {API_URL} from '../../utils/react_constants';

exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    res.render('./assign-to-section', {
        scripts: ['/static/react_apps.js'],
        assignmentId: req.params.assignmentId,
        courseId: req.query.courseId,
        userId: req.App.user.userId,
        apiUrl: API_URL
    });
};
