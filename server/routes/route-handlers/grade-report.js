const consts = require('../../utils/constants');
exports.get = (req, res) => {
  res.render('user-grade-report', {
    scripts: ['/static/react_apps.js'],
    userId: req.App.user.userId,
    apiUrl: consts.API_URL
  });
}
