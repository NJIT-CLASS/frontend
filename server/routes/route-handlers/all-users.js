exports.get = (req, res) => {
    res.render('all-users', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId
    });
};
