const consts = require('../../utils/constants');
  exports.get = (req, res) => {
    res.render('./assign-to-section', {
      scripts: ['/static/react_apps.js'],
      assignmentId: req.params.assignmentId,
      courseId: req.query.courseId,
      userId: req.App.user.userId,
      apiUrl: consts.API_URL
    });
  }
