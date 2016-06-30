const consts = require('../../utils/constants');
exports.get = (req, res) => {
  res.render('./asa', {
    scripts: ['/static/react_apps.js'],
    userId: req.App.userId,
    apiUrl: consts.API_URL
  });
}
