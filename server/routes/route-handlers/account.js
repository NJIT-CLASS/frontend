
exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('account', {
        scripts: ['/static/react_apps.js', '/static/vendor/zxcvbn.min.js'],
        userId: req.App.user.userId
    });
};
