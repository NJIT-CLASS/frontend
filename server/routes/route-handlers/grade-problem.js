exports.get = (req, res) => {
    res.render('grade', {
        title: 'Grade Problem',
        pageHeader: 'Grade Problem'
    });
};
