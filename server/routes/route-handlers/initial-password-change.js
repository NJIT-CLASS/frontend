exports.get = (req, res) => {

    //make call to check if user is actually Pending
    if(req.App.user === undefined){
        return res.redirect('/');
    }
    req.App.api.get('/user/pendingStatus/' + req.App.user.userId, {token: req.session.token},(err, statusCode, body) => {
        if(statusCode === 401){
            return res.status(404).end();
        }else{
            return res.render('initial-password-change');
        }
    });

};

exports.post = (req, res) => {
    let {currentpassword, newpassword, confirmpassword} = req.body;

    req.App.api.get('/user/pendingStatus/' + req.App.user.userId,{token: req.session.token}, (err, statusCode, body) => {
        if(statusCode === 401){
            return res.status(404).end();
        }

        if(currentpassword === '' || newpassword === '' || confirmpassword === ''){
            return res.render('initial-password-change', {
                fieldsMissing: true
            });
        }else if (newpassword !== confirmpassword) {
            return res.render('initial-password-change', {
                mismatchPassword: true
            });
        }
        else if (newpassword.length < 6) {
            return res.render('initial-password-change', {
                shortPassword: true
            });
        }

        req.App.api.post('/update/password',{
            userId: req.App.user.userId,
            oldPasswd: currentpassword,
            newPasswd: newpassword
        } ,(err, statusCode, body) => {
            if(err || statusCode === 401){
                return res.render('initial-password-change', {
                    serverError: true
                });
            } else {
                return res.redirect('/');
            }
        });

    });
};
