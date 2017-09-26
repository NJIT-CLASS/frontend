
exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('reallocation', {
        scripts: ['/static/react_apps.js', '/static/vendor/zxcvbn.min.js'],
        userId: req.App.user.userId
    });
};