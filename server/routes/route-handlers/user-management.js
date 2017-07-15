exports.get = (req, res) => {

    if(req.App.user === undefined){
        return res.redirect('/');
    }
    res.render('user-management', {
        scripts: ['/static/react_apps.js']
    });
};
