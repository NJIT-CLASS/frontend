exports.get = (req, res) => {
    res.render('createproblem', {
        title: 'Create Problem',
        pageHeader: 'Create Problem'
    });
};
