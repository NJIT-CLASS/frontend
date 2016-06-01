const consts = require('../../utils/constants');
exports.get = (req, res) => {
  res.render('./task/edit', {
    scripts: ['/static/react_apps.js'],
    userId: req.App.user.userId,
    sectionId: req.query.sectionId,
    taskId: req.params.taskId,
    apiUrl: consts.API_URL
});
};
