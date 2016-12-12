exports.get = (req, res) => {
    res.render('settings', {
        userId: req.App.user.userId,
        userEmail: req.App.user.email,
        userFirstName: req.App.user.firstName,
        userLastName: req.App.user.lastName,
        userCountry: req.App.user.country,
        userCity: req.App.user.city,
        userIsAdmin: true
    });
};

exports.post = (req, res) => {
    var options = {
        userId: req.App.user.userId,
        userEmail: req.App.user.email,
        userFirstName: req.App.user.firstName,
        userLastName: req.App.user.lastName
    };

    // I would have liked to just have one res.render() call at the very end rather than having to repeat it for each case
    // But the variable passing doesn't seem to play nice with that, so...

    if (req.body.what_was_changed=='name') {
        req.App.api.put('/update/name', {firstname: req.body.field_firstName, lastname:req.body.field_lastName, userid:req.App.user.userId}, (err, statusCode, body) => {
            // if(body.Message=='Success') {       // success
                // TODO: check contents of reply to see if name change actually succeeded
                options.statuscode = statusCode;
                options.namechangesucceeded = true;
                options.userFirstName = body.FirstName;
                options.userLastName = body.LastName;
                res.render('settings', options);
            // }
            // else {                  // error
            //     options.statuscode = statusCode;
            //     options.namechangefailed = true;
            //     res.render('settings', options);
            // }
        });
    }
    else if (req.body.what_was_changed=='email') {

        req.App.api.put('/update/email', {userid: req.App.user.userId, email:req.body.field_newEmail, password:req.body.field_password}, (err, statusCode, body) => {
            // console.log(err, statusCode)
            // if(body.Message=='Success') {       // success
                options.emailchangesucceeded = true;
                options.userEmail = req.body.field_newEmail;
                options.statuscode = statusCode;
                res.render('settings', options);
            // }
            // else {                      // error
            //     options.emailchangefailed = true;
            //     options.statuscode = statusCode;
            //     res.render('settings', options);
            // }
        });
    }
    else if (req.body.what_was_changed=='status') {     // TODO: fill in API endpoints here once they're available
        /*
        req.App.api.put('/path/to/backend', {userid: req.App.user.userId, password:req.body.field_statusPassword}, (err, statusCode, body) => {
            if(statusCode==200) {       // success
                options.adminoptoutsucceeded = true;
                options.statuscode = statusCode;
                res.render('settings', options);
            }
            else {                      // error
                options.adminoptoutfailed = true;
                statuscode = statusCode;
                res.render('settings', options);
            }
        });
        */
    }
    else if (req.body.what_was_changed=='password') {

        // If the "confirm password" doesn't match the new password entered, then alert the user and abort the operation
        if (req.body.field_newPassword != req.body.field_confirmNewPassword) {
          options.passwordchangesucceeded = true;
          res.render('settings', options);
            return;
         }

        req.App.api.put('/update/password', {userId: req.App.user.userId, newPasswd:req.body.field_newPassword, oldPasswd :req.body.field_currentPassword}, (err, statusCode, body) => {
            if(statusCode==200) {       // success
                options.passwordchangesucceeded = true;
                options.statuscode = statusCode;
                res.render('settings', options);
            }
            else {                      // error
                options.passwordchangefailed = true;
                options.statuscode = statusCode;
                res.render('settings', options);
            }
        });
    }

    else if (req.body.what_was_changed=='upload-img') {


      options.onlyPNG  = true;
      res.render('settings', options);
    }

    else {
        res.render('settings', options);
    }
};
