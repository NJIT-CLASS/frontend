
exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    res.render('section', {
        scripts: ['/static/react_apps.js'],
        userId: req.App.user.userId,
        sectionId: req.params.sectionId,
        showHeader: false,
    });
};
