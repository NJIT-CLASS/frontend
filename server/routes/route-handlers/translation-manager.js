exports.get = (req, res) => {
    res.render('translation_management', {
        showHeader: false,
        scripts: ['/static/react_apps.js']
    });
};
