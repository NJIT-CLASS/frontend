exports.get = (req, res) => {
    delete req.session.userId;
    delete req.session.lang;
    res.redirect('/');
};
