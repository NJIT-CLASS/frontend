exports.get = (req, res) => {
    if (req.App.user && req.App.user.userId) {
        return res.redirect('/dashboard');
    }

    res.render('home');
};

exports.post = (req, res) => {
    req.App.api.post('/login', {emailaddress: req.body.email, password:req.body.password}, (err, statusCode, body) => {
        if(body && body.UserID && body.Message == 'Success'){
            req.session.userId = body.UserID;
            return res.redirect('/dashboard');
        }

        res.render('home',{
            error: true
        });
    });
};
