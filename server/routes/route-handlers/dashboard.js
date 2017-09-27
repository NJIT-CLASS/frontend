exports.get = (req, res) => {
    if( req.App.user === undefined){
        res.redirect('/');
        return;

    }
    res.render('dashboard', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId
    });
};
