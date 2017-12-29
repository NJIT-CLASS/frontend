
exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    res.render('reallocation', {
        scripts: ['/static/react_apps.js', '/static/vendor/zxcvbn.min.js'],
        userId: req.App.user.userId
    });
};