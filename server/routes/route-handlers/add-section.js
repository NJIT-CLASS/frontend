const consts = require('../../utils/constants');

exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('add-section', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        apiUrl: consts.API_URL
    });
};
