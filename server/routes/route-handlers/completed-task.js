exports.get = (req, res) => {
    res.render('task', {
        title: 'Completed Task',
        pageHeader: 'Completed Task Score'
    });
};
