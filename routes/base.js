const express = require('express');
//custom translation script
var i18n = require('i18n');

const cryptoJS = require('crypto-js');

const consts = require('../utils/constants');
const router = express.Router();

// login
router.route('/')
    .get((req, res) => {
        if (req.App.user && req.App.user.userId) {
            return res.redirect('/dashboard');
        }

        res.render('home', {
            title: 'CLASS Home'	
        });
	
		
    })
    .post((req, res) => {
        req.App.api.post('/login', {emailaddress: req.body.email, password:req.body.password}, (err, statusCode, body) => {
            if(body && body.UserID && body.UserID.length > 0 && body.Message == 'Success'){
                const id = body.UserID[0].UserID;
                const encryptedUserId = cryptoJS.AES.encrypt(id.toString(), consts.USER_SECRET).toString();
                res.cookie('user', encryptedUserId);
                return res.redirect('/dashboard');
            }

            res.render('home',{
                title: 'CLASS Home',
                error: true
            });
        });
    });

// logout
router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.redirect('/');
});

// reset password
router.get('/password_reset', (req, res) => {
    res.render('password_reset', {
        title: 'Reset Password'
    });
});

router.post('/resetConfrim',(req,res)=>{
    if(req.body.password == req.body.confrimpassword){
        req.App.api.put('/update/password',{password:req.body.password,userid:req.body.userid}, (err, statusCode, body) => {
           return res.redirect('/'); 
        });
    }else{
        res.render('home',{
            error: true
        });
    }
});

router.post('/accountmanagement', (req, res) => {
	if (req.body.what_was_changed=="name") {
		req.App.api.put('/update/name', {firstname: req.body.field_firstName, lastname:req.body.field_lastName, userid:req.App.user.userId}, (err, statusCode, body) => {
	    	if(body.Message=="Success") {		// success
	    		// TODO: check contents of reply to see if name change actually succeeded
	        	res.render('account_management', {
                    title: 'Account Management',
                    pageHeader: 'Account Management',
                    userId: req.App.user.userId,
                    userEmail: req.App.user.email,
                    userFirstName: req.App.user.firstName,
                    userLastName: req.App.user.lastName,
                    scripts: ['/static/account_management.js'],
                    namechangesucceeded: true,
                    statuscode: statusCode
                });
	        }
	        else {					// error
                res.render('account_management', {
                    title: 'Account Management',
                    pageHeader: 'Account Management',
                    userId: req.App.user.userId,
                    userEmail: req.App.user.email,
                    userFirstName: req.App.user.firstName,
                    userLastName: req.App.user.lastName,
                    scripts: ['/static/account_management.js'],
                    namechangefailed: true,
                    statuscode: statusCode
                });
	        }
	    });
	}
	else if (req.body.what_was_changed=="email") {
		req.App.api.put('/update/email', {userid: req.App.user.userId, email:req.body.field_newEmail, password:req.body.field_password}, (err, statusCode, body) => {
	    	console.log(body);
	    	if(body.Message=="Success") {		// success
	    		res.render('account_management',{
	                emailchangesucceeded: true,
	                newemail: body.EmailAddress,
	                statuscode: statusCode
	            });
	        }
	        else {						// success
	        	res.render('account_management',{
	                emailchangefailed: true,
	                statuscode: statusCode
	            });
	        }
	    }); 
	}
	else if (req.body.what_was_changed=="password") {
		
		// If the "confirm password" doesn't match the new password entered,
		// then alert the user and abort the operation
		if (req.body.field_newPassword != req.body.field_confirmNewPassword) {
			console.log("PASSWORD MISMATCH");
			// TODO: alert user that the password didn't match
			res.render('account_management',{
                passwordchangemismatch: true
            });
			return;
		}
		
		console.log("PAST MISMATCH CHECK");
		
		req.App.api.put('/update/password', {userid: req.App.user.userId, password:req.body.field_newPassword, oldpassword:req.body.field_currentPassword}, (err, statusCode, body) => {
	    	if(statusCode==200) {		// success
	        	res.render('account_management',{
	                passwordchangesucceeded: true,
	                statuscode: statusCode
	            });
	        }
	        else {						// error
	        	res.render('account_management',{
	                passwordchangefailed: true,
	                statuscode: statusCode
	            });
	        }
	    });
	}
	else {
        res.render('account_management', {
            title: 'Account Management',
            pageHeader: 'Account Management',
            userId: req.App.user.userId,
            userEmail: req.App.user.email,
            userFirstName: req.App.user.firstName,
            userLastName: req.App.user.lastName,
            scripts: ['/static/account_management.js']
        });
	}
});

router.get('/accountmanagement', (req, res) => {
	res.render('account_management', {
        title: 'Account Management',
        pageHeader: 'Account Management',
        userId: req.App.user.userId,
        userEmail: req.App.user.email,
        userFirstName: req.App.user.firstName,
        userLastName: req.App.user.lastName,
        scripts: ['/static/account_management.js']
    });
});

/*
router.post('/accountmanagement/changename', (req, res) => {
    req.App.api.put('/update/name', {firstname: req.body.field_firstName, lastname:req.body.field_lastName, userid:req.App.user.userId}, (err, statusCode, body) => {
    	if(body.Message=="Success") {		// success
    		// TODO: check contents of reply to see if name change actually succeeded
        	res.render('account_management',{
                namechangesucceeded: true,
                statuscode: statusCode
            });
        }
        else {					// error
        	res.render('account_management',{
                namechangefailed: true,
                statuscode: statusCode
            });
        }
    }); 
});

router.post('/accountmanagement/changeemail', (req, res) => {
    req.App.api.put('/update/email', {userid: req.App.user.userId, email:req.body.field_newEmail, password:req.body.field_password}, (err, statusCode, body) => {
    	console.log(body);
    	if(body.Message=="Success") {		// success
    		res.render('account_management',{
                emailchangesucceeded: true,
                newemail: body.EmailAddress,
                statuscode: statusCode
            });
        }
        else {						// success
        	res.render('account_management',{
                emailchangefailed: true,
                statuscode: statusCode
            });
        }
    }); 
});

router.post('/accountmanagement/changepassword', (req, res) => {
    req.App.api.put('/update/password', {userid: req.App.user.userId, password:req.body.field_newPassword, oldpassword:req.body.field_currentPassword}, (err, statusCode, body) => {
    	if(statusCode==200) {		// success
        	res.render('account_management',{
                passwordchangesucceeded: true,
                statuscode: statusCode
            });
        }
        else {						// error
        	res.render('account_management',{
                passwordchangefailed: true,
                statuscode: statusCode
            });
        }
    });
});

router.post('/accountmanagement/changename', (req, res) => {
    req.App.api.post('/update/password', {userid: req.App.user.userId, password:req.body.field_newPassword, oldpassword:req.body.field_currentPassword}, (err, statusCode, body) => {
        if(statusCode==200) {	// success
        	res.render('accountmanagement',{
        		passwordchangesucceeded: true
                
            });
        }
        else {					// error
        	res.render('accountmanagement',{
                passwordchangefailed: true,
                statuscode: statusCode
            });
        }
    });
});
*/

// dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'CLASS Dashboard',
		pageHeader: 'Dashboard',

    });
});

router.get('/myclasses', (req, res) => {
    res.render('myclasses', {
        title: 'My Classes',
		pageHeader: 'My Classes'
    });
});

router.get('/instructormanagement', (req, res) => {
    res.render('instructormanagement', {
        title: 'Instructor Management',
		pageHeader: 'Instructor Management'
    });
});

// about
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
		pageHeader: 'About'				
    });	
});

// create course
router.get('/create-course', (req, res) => {
    res.render('create_course', {
        title: 'Create Course',
        pageHeader: 'Create Course',
        scripts: ['/static/create_course.js']
    });
});

router.get('/create-account/:id', (req, res) => {
    res.render('create_account', {
        title: 'Create CLASS Account'
    });
})

router.get('/create-assignment', (req, res) => {
    res.render('create_assignment', {
        title: 'Create Assignment',
        showHeader: false,
        scripts: ['/static/create_assignment.js']
    });
})

module.exports = router;
