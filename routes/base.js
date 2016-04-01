const express = require('express');

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
                req.session.userId = body.UserID[0].UserID;
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
    delete req.session.userId;
    res.redirect('/');
});

// reset password
router.get('/password_reset', (req, res) => {
    res.render('password_reset', {
        title: 'Reset Password'
    });
});

// semester management
router.get('/semestermanagement', (req, res) => {
    res.render('semester_management', {
        title: 'Semester Management'
    });
});

router.post('/semestermanagement', (req, res) => {
	// Check to make sure start date comes before end date
	if (req.body.field_endDate < req.body.field_startDate) {
		res.render('semester_management', {
	        title: 'Semester Management',
	        startenddateimpossible: true,
	        namefillin: req.body.field_semesterName,
	        startdatefillin: req.body.field_startDate,
	        enddatefillin: req.body.field_endDate
	    });
	}
	else {
		// Currently, the only two responses are a 401 error or a message with just the semester ID
		req.App.api.post('/CreateSemester',{semesterName:req.body.field_semesterName,startDate:req.body.field_startDate,endDate:req.body.field_endDate}, (err, statusCode, body) => {
			if(statusCode==401) {
				res.render('semester_management', {
			        title: 'Semester Management',
			        semestercreationfailed: true
			    });
			}
			else {
				res.render('semester_management', {
			        title: 'Semester Management',
			        semestercreationsucceeded: true
			    });
			}
		});
	}
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
    var options = {
                    title: 'Account Management',
                    pageHeader: 'Account Management',
                    userId: req.App.user.userId,
                    userEmail: req.App.user.email,
                    userFirstName: req.App.user.firstName,
                    userLastName: req.App.user.lastName
                }
	if (req.body.what_was_changed=="name") {
		req.App.api.put('/update/name', {firstname: req.body.field_firstName, lastname:req.body.field_lastName, userid:req.App.user.userId}, (err, statusCode, body) => {
	    	if(body.Message=="Success") {		// success
	    		// TODO: check contents of reply to see if name change actually succeeded
                options.statuscode = statusCode;
                options.namechangesucceeded = true;
	        	res.render('account_management', options);
	        }
	        else {					// error
                res.render('account_management', {
                    title: 'Account Management',
                    pageHeader: 'Account Management',
                    userId: req.App.user.userId,
                    userEmail: req.App.user.email,
                    userFirstName: req.App.user.firstName,
                    userLastName: req.App.user.lastName,
                    namechangefailed: true,
                    statuscode: statusCode
                });
	        }
	    });
	}
	else if (req.body.what_was_changed=="email") {
		req.App.api.put('/update/email', {userid: req.App.user.userId, email:req.body.field_newEmail, password:req.body.field_password}, (err, statusCode, body) => {
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
	else if (req.body.what_was_changed=="status") {
		
		// TODO: fill in API endpoints here once they're available
		/*
		req.App.api.put('/path/to/backend', {userid: req.App.user.userId, password:req.body.field_statusPassword}, (err, statusCode, body) => {
	    	if(statusCode==200) {		// success
	        	res.render('account_management',{
	                adminoptoutsucceeded: true,
	                statuscode: statusCode
	            });
	        }
	        else {						// error
	        	res.render('account_management',{
	                adminoptoutfailed: true,
	                statuscode: statusCode
	            });
	        }
	    });
	    */
	}
	else if (req.body.what_was_changed=="password") {
		
		// If the "confirm password" doesn't match the new password entered,
		// then alert the user and abort the operation
		if (req.body.field_newPassword != req.body.field_confirmNewPassword) {
			res.render('account_management',{
                passwordchangemismatch: true
            });
			return;
		}
		
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
            userLastName: req.App.user.lastName
        });
	}
});

// TODO: once the endpoint is available, seed correct values for user status (e.g. admin)
// for now it's hardcoded as true so we can see the corresponding UI on the acct mgmt page
router.get('/accountmanagement', (req, res) => {
	res.render('account_management', {
        title: 'Account Management',
        pageHeader: 'Account Management',
        userId: req.App.user.userId,
        userEmail: req.App.user.email,
        userFirstName: req.App.user.firstName,
        userLastName: req.App.user.lastName,
        userIsAdmin: true
    });
});

// dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        title: 'CLASS Dashboard',
		pageHeader: 'Dashboard',

    });
});

// about
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
		pageHeader: 'About'				
    });	
});

// course page
router.get('/course_page', (req, res) => {
    res.render('course_page', {
        title: 'Course Page',
		pageHeader: 'Course Page'				
    });	
});


// admin
router.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'Administrator Page',
		pageHeader: 'Administrator Page'				
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
