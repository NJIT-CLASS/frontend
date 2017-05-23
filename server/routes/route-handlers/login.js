exports.get = (req, res) => {
    if (req.App.user && req.App.user.userId) {
        return res.redirect('/dashboard');
    }

    req.App.api.get('/initial', (err, statusCode, body) => {
        if(statusCode == 400){
            return res.redirect('/onboarding');
        }

        return res.render('home',{
            returnUrl: req.query.url
        });
    });
};

exports.post = (req, res) => {

    req.App.api.post('/login', {emailaddress: req.body.email, password:req.body.password}, (err, statusCode, body) => {
        if(!body){
            return res.render('home',{
                credentialsError: true
            });
        }

        switch(statusCode){
        case 500:
            return res.render('home',{
                serverError: true
            });
        case 201:
        case 200:
            req.session.userId = body.UserID;
            req.session.token = body.Token;
            // THIS WILL REDIRECT TO SETTINGS IF THE USER IS NEWLY ADDED.
            if(body.Pending === true){
                return res.redirect('/initial-password-change');
            } else {
                return res.redirect(req.body.url || '/');
            }
        case 401:
            if(body.Timeout){
                return res.render('home',{
                    credentialsError: true,
                    timeout: body.Timeout
                });
            } else {
                return res.render('home',{
                    credentialsError: true
                });
            }

        default:
            return res.send('Broked :\'(');
        }
    });
};
