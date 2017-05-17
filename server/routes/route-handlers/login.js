exports.get = (req, res) => {
    if (req.App.user && req.App.user.userId) {
        return res.redirect('/dashboard');
    }

    res.render('home',{
    	returnUrl: req.query.url
    });
};

exports.post = (req, res) => {

    req.App.api.post('/login', {emailaddress: req.body.email, password:req.body.password}, (err, statusCode, body) => {
        
        if(body && body.UserID && body.Message == 'Success'){
            req.session.userId = body.UserID;
            req.session.token = body.Token;
            if(statusCode !== 401 && body.Pending === true){ // THIS WILL REDIRECT TO SETTINGS IF THE USER IS NEWLY ADDED.
                return res.redirect('/account');
            }else return res.redirect(req.body.url || '/');
        }

        if(statusCode === 500){
            res.render('home',{
                serverError: true
            });
        }else{
            res.render('home',{
                credentialsError: true
            });
        }

    });
};
