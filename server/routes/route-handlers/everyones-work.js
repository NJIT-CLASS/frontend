
exports.get = (req, res) => {
    if(req.App.user === undefined){
        res.redirect('/');
    }
    res.render('everyones-work', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        assignmentId: req.params.assignmentId
    });
};
