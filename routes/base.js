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
router.get('/reset', (req, res) => {
    res.render('password_reset', {
        title: 'Reset Password'
    });
});


router.get('/accountmanagement', (req, res) => {
    res.render('account_management', {
        title: 'Account Management',
        pageHeader: 'Account Management',
        userId: req.App.user.userId,
        scripts: ['/static/account_management.js']
    });
});

router.post('/accountmanagement/changename', (req, res) => {
    req.App.api.put('/update/name', {firstname: req.body.field_firstName, lastname:req.body.field_lastName, userid:req.App.user.userId}, (err, statusCode, body) => {
    	if(statusCode==200) {		// success
        	res.render('account_management',{
                namechangesucceeded: true
            });
        }
        else {					// error
        	res.render('account_management',{
                namechangefailed: true
            });
        }
    }); 
});

router.post('/accountmanagement/changeemail', (req, res) => {
    req.App.api.put('/update/email', {userid: req.App.user.userId, email:req.body.field_newEmail, password:req.body.field_password}, (err, statusCode, body) => {
    	console.log(body);
    	if(statusCode==200) {		// success
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
                passwordchangesucceeded: true
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

router.get('/create-account/:id', (req, res) => {
    res.render('create_account', {
        title: 'Create CLASS Account'
    });
})

module.exports = router;
