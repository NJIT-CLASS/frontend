exports.get = (req, res) => {
    req.App.api.get('/initial', (err, statusCode, body) => {
        if(statusCode === 400){
            return res.render('onboarding');
        }
        return res.status(404).end();
    });
};

exports.post = (req, res) => {
    let {firstname, lastname, email, password, confirmpassword} = req.body;
    firstname = firstname.replace(/\s/g,'');
    lastname = lastname.replace(/\s/g,'');
    email = email.replace(/\s/g,'');

    if(firstname === '' || lastname === '' || email === '' || password === '' || confirmpassword === ''){
        return res.render('onboarding', {
            fieldsMissing: true
        });
    }else if (password !== confirmpassword) {
        return res.render('onboarding', {
            mismatchPassword: true
        });
    }


    req.App.api.get('/initial', (err, statusCode, body) => {
        if(statusCode !== 400){
            return res.status(404).end();;
        }

        req.App.api.post('/adduser', {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            instructor: true,
            admin: true,
            trustpassword: true
        }, (err,statusCode, body) => {
            switch(statusCode){
            case 400:
          //missing field
                return res.render('onboarding', {
                    fieldsMissing: true
                });
            case 500:
          //server error
                return res.render('onboarding', {
                    serverError: true
                });
            default:
        //success
                return res.redirect('/');
            }
        });

    });

};
