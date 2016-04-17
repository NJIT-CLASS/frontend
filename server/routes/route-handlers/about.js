exports.get = (req, res) => {
    res.render('about', {
        title: 'About',
        pageHeader: 'About'
    });
};