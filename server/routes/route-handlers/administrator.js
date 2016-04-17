exports.get = (req, res) => {
    res.render('admin', {
        title: 'Administrator Page',
        pageHeader: 'Administrator Page'                
    });
};