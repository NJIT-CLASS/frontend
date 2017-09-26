
exports.get = (req, res) => {
    if(req.App.user === undefined){
      res.redirect('/');
    }
    res.render('game-settings', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId
    });
};
