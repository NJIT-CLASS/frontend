exports.get = (req, res) => {
    if (req.App.user && req.App.user.userId) {
        return res.redirect('/dashboard');
    }

    if('masqueraderId' in req.session){
        delete req.session.masqueraderId;
    }

    var existUsers = req.app.get('isInitial');
    if(existUsers == null || existUsers === false){
        req.app.set('isInitial', false);
        req.App.api.get('/initial', (err, statusCode, body) => {

            if(statusCode == 400){
                req.app.set('isInitial', false);
                return res.redirect('/onboarding');
            }
            req.app.set('isInitial', true);
            return res.render('home',{
                returnUrl: req.query.url,
                layout:'logged_out',
                title: 'Login | PL System'
            });
        });
    }  else {
        if(existUsers){
            return res.render('home',{
                returnUrl: req.query.url,
                layout:'logged_out',
                title: 'Login | PL System'
            });
        }
        else {
            return res.render('home',{
                returnUrl: req.query.url,
                layout:'logged_out',
                title: 'Login | PL System'
            });
        }
    }
  

    
    return;
};

exports.post = (req, res) => {

    return req.App.api.post('/login', {emailaddress: req.body.email, password:req.body.password}, (err, statusCode, body) => {


        switch(statusCode){
        case 500:
            return res.render('home',{
                serverError: true,
                returnUrl: req.body.url,
                layout:'logged_out',
                title: 'Login | PL System'
                
                
            });
        case 201:
        case 200:
            req.session.userId = body.UserID;
            req.session.token = body.Token;
            req.session.refreshToken = body.RefreshToken;
            // THIS WILL REDIRECT TO SETTINGS IF THE USER IS NEWLY ADDED.
            if(body.Pending === true){
                return res.redirect('/initial-password-change');
            } else {
                return res.redirect(req.body.url || '/');
            }
        case 400:
        case 401:
            if(body !== undefined){
                if(body.Timeout){
                    return res.render('home',{
                        credentialsError: true,
                        timeout: body.Timeout,
                        returnUrl: req.body.url,
                        layout:'logged_out',
                        title: 'Login | PL System'
                        
                        
                    });
                }
                return res.render('home',{
                    credentialsError: true,
                    returnUrl: req.body.url,
                    layout:'logged_out',
                    title: 'Login | PL System'
                    
                    
                });
            }
            else {
                return res.render('home',{
                    credentialsError: true,
                    returnUrl: req.body.url,
                    layout:'logged_out',
                    title: 'Login | PL System'
                    
                    
                    
                });
            }

        default:
            console.log(statusCode);
            return res.send('Broked :\'(');
        }
    });
};
