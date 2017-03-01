const consts = require('../../utils/constants');
exports.get = (req, res) => {
  res.render('./task-status-table', {
    scripts: ['/static/react_apps.js'],
    userId: req.App.user.userId,
    assignmentId: req.params.assignmentId,
    apiUrl: consts.API_URL
  });
}
