exports.get = (req, res) => {
    res.render('editproblem', {
        title: 'Edit Problem',
        pageHeader: 'Edit Problem'
    });
};
