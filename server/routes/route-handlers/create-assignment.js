exports.get = (req, res) => {
    res.render('create_assignment', {
        title: 'Create Assignment',
        showHeader: false,
        scripts: ['/static/react_apps.js']
    });
};
