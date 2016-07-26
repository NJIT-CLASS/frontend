const consts = require('../../utils/constants');
  exports.get = (req, res) => {
    res.render('./assign-to-section', {
      scripts: ['/static/react_apps.js'],
      courseId: req.params.courseId,
      userId: req.App.userId,
      apiUrl: consts.API_URL
    });
  }
