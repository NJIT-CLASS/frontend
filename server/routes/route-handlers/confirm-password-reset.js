exports.get = (req, res) => {
    if(req.body.password == req.body.confrimpassword){
        req.App.api.put('/update/password',{password:req.body.password,userid:req.body.userid, token: req.session.token}, (err, statusCode, body) => {
            return res.redirect('/'); 
        });
    }else{
        res.render('home',{
            error: true
        });
    }
};
