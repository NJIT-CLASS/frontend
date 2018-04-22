exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('add-user', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        userType: req.App.user.role
    });
};
