exports.get = (req, res) => {
    if( req.App.user === undefined){
        res.redirect('/');
        return;

    }

    return res.render('instructorGradeReport', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        assignmentId: req.params.assignmentId
    });
    






};
