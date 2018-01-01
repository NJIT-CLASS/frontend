exports.get = (req, res) => {
    delete req.session.userId;
    delete req.session.lang;
    delete req.session.token;
    res.redirect('/');
};
