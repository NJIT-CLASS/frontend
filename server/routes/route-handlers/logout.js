exports.get = (req, res) => {
    delete req.session.userId;
    res.redirect('/');
};