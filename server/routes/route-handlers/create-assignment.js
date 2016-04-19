exports.get = (req, res) => {
    res.render('create_assignment', {
        showHeader: false,
        scripts: ['/static/react_apps.js']
    });
};
