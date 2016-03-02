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
router.get('/reset', (req, res) => {
    res.render('reset', {
        title: 'Reset Password'
    });
});


router.get('/accountmanagement', (req, res) => {
    res.render('account_management', {
        title: 'Account Management',
        userId: 1,
        //userId: req.App.user.userId,		//TODO: uncomment this and delete hardcoded line
        scripts: ['/static/account_management.js']
    });
});

router.post('/accountmanagement/changeemail', (req, res) => {
	console.log(req.body);   // TODO: uncomment below and delete this line (untested below)
    req.App.api.post('/update/email', {userid: req.App.user.userId, email:req.body.field_newEmail, password:req.body.field_password}, (err, statusCode, body) => {
        if(statusCode==401) {	// error
        	res.render('accountmanagement',{
                emailchangefailed: true
            });
        }
        else {					// success
        	res.render('accountmanagement',{
                emailchangesucceeded: true,
                newemail: body.EmailAddress
            });
        }
    }); 
});

router.post('/accountmanagement/changepassword', (req, res) => {
	console.log(req.body);   // TODO: delete this line?
    req.App.api.post('/update/password', {userid: req.App.user.userId, password:req.body.field_newPassword, oldpassword:req.body.field_currentPassword}, (err, statusCode, body) => {
        if(statusCode==401) {	// error
        	res.render('accountmanagement',{
                passwordchangefailed: true
            });
        }
        else {					// success, status code 200
        	res.render('accountmanagement',{
                passwordchangesucceeded: true
            });
        }
    });
});

router.post('/accountmanagement/changename', (req, res) => {
	console.log(req.body);  // TODO: uncomment below and delete this line (untested below)
    req.App.api.post('/update/password', {userid: req.App.user.userId, password:req.body.field_newPassword, oldpassword:req.body.field_currentPassword}, (err, statusCode, body) => {
        if(statusCode==401) {	// error
        	res.render('accountmanagement',{
                passwordchangefailed: true
            });
        }
        else {					// success, status code 200
        	res.render('accountmanagement',{
                passwordchangesucceeded: true
            });
        }
    });
});


// dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'CLASS Dashboard',
		pageHeader: 'Dashboard'
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
        scripts: ['/static/create_course.js']
    });
});

module.exports = router;
