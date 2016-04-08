const express = require('express');
const async = require('async');

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
            if(body && body.UserID && body.Message == 'Success'){
                req.session.userId = body.UserID;
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
                };

	// I would have liked to just have one res.render() call at the very end rather than having to repeat it for each case
	// But the variable passing doesn't seem to play nice with that, so...

	if (req.body.what_was_changed=="name") {
		req.App.api.put('/update/name', {firstname: req.body.field_firstName, lastname:req.body.field_lastName, userid:req.App.user.userId}, (err, statusCode, body) => {
	    	if(body.Message=="Success") {		// success
	    		// TODO: check contents of reply to see if name change actually succeeded
                options.statuscode = statusCode;
                options.namechangesucceeded = true;
                options.userFirstName = body.FirstName;
                options.userLastName = body.LastName;
                res.render('account_management', options);
	        }
	        else {					// error
	        	options.statuscode = statusCode;
	        	options.namechangefailed = true;
                res.render('account_management', options);
	        }
	    });
	}
	else if (req.body.what_was_changed=="email") {
		req.App.api.put('/update/email', {userid: req.App.user.userId, email:req.body.field_newEmail, password:req.body.field_password}, (err, statusCode, body) => {
	    	if(body.Message=="Success") {		// success
	    		options.emailchangesucceeded = true;
	    		options.userEmail = body.EmailAddress;
	    		options.statuscode = statusCode;
                res.render('account_management', options);
	        }
	        else {						// error
	        	options.emailchangefailed = true;
	        	options.statuscode = statusCode;
                res.render('account_management', options);
	        }
	    }); 
	}
	else if (req.body.what_was_changed=="status") {		// TODO: fill in API endpoints here once they're available
		/*
		req.App.api.put('/path/to/backend', {userid: req.App.user.userId, password:req.body.field_statusPassword}, (err, statusCode, body) => {
	    	if(statusCode==200) {		// success
	    		options.adminoptoutsucceeded = true;
	    		options.statuscode = statusCode;
                res.render('account_management', options);
	        }
	        else {						// error
	        	options.adminoptoutfailed = true;
	        	statuscode = statusCode;
                res.render('account_management', options);
	        }
	    });
	    */
	}
	else if (req.body.what_was_changed=="password") {
		
		// If the "confirm password" doesn't match the new password entered, then alert the user and abort the operation
		if (req.body.field_newPassword != req.body.field_confirmNewPassword) {
			options.passwordchangemismatch = true;
			res.render('account_management', options);
			return;
		}
		
		req.App.api.put('/update/password', {userid: req.App.user.userId, password:req.body.field_newPassword, oldpassword:req.body.field_currentPassword}, (err, statusCode, body) => {
	    	if(statusCode==200) {		// success
	    		options.passwordchangesucceeded = true;
	    		options.statuscode = statusCode;
                res.render('account_management', options);
	        }
	        else {						// error
	        	options.passwordchangefailed = true;
	    		options.statuscode = statusCode;
                res.render('account_management', options);
	        }
	    });
	}
	else {
		res.render('account_management', options);
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
    req.App.api.get('/getCourseCreated/' + req.App.user.userId, (err, statusCode, body) => {
    	var courseList = [];
    	for(var i=0; i<body.Courses.length; i++){
    		courseList.push(body.Courses[i]);
    	}

        res.render('dashboard', {
            title: 'CLASS Dashboard',
    		pageHeader: 'Dashboard',
    		courseList: courseList 
    	});
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
router.get('/course_page/:Id', (req, res) => {
	req.App.api.get('/course/' + req.params.Id, (err, statusCode, body) =>{	
        var sectionList = [];
        var apiCalls = {};
        for (var i=0; i<body.Sections.length; i++){
            sectionList.push(body.Sections[i]);

            apiCalls[body.Sections[i].SectionID] = ((Sections) => {
                return (callback)=>	{
                    req.App.api.get('/course/getsection/' + Sections.SectionID, (err, statusCode, body) =>{
                        var sectionMembers = body.Section;	
                        var sectionMembersApiCalls = [];	
                        for (var q=0; q<sectionMembers.length; q++){
                            sectionMembersApiCalls.push(req.App.api.get.bind(this, '/generalUser/' + sectionMembers[q].UserID));
                        }
			 
    					async.parallel(sectionMembersApiCalls, (err, memberResults) => {
    						var members = [];
    						for (var w=0; w<memberResults.length; w++){
    							members.push (memberResults[w][1].User[0]);
    						}
    						callback(null, members);
    					});
    				});
    			}
    		})(body.Sections[i]);
        }
	
        async.parallel(apiCalls, (err, results)=>{
            for(var i=0; i<sectionList.length; i++){
                var currentSectionId = sectionList[i].SectionID;
                sectionList[i].members=results[currentSectionId];
    		}
		
            res.render('course_page', {
                title: 'Course Page',
                pageHeader: 'Course Page',	
                sectionList: sectionList,	
                courseID: req.params.Id,
                courseTitle: body.Course[0].Title
            });
        });
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
        scripts: ['/static/create_course.js'],
        userId: req.App.user.userId,
        apiUrl: consts.API_URL
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
