const consts = require('../../utils/constants');
exports.get = (req, res) => {
  res.render('volunteer_pool', {
    scripts: ['/static/react_apps.js'],
    userId: req.App.user.userId,
    courseId: req.query.courseId,
    sectionId: req.query.sectionId,
    apiUrl: consts.API_URL
  });
}
