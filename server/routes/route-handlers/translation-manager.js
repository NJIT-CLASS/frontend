exports.get = (req, res) => {
    res.render('translation_management', {
        title: 'Translation manager',
        showHeader: false,
        scripts: ['/static/translation.js']
    });
};
