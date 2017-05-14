import {API_URL} from '../../utils/react_constants';
exports.get = (req, res) => {
    res.render('./task-status-table', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        assignmentId: req.params.assignmentId,
        apiUrl: API_URL
    });
};
