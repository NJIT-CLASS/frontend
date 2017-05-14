const async = require('async');

exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    let coursesUrl = '/course/';
    if(req.App.user.role === 'student'){
        coursesUrl = '/getActiveEnrolledCourses/';
    }
    req.App.api.get(coursesUrl + req.params.Id, (err, statusCode, body) =>{
        const sectionIDsArray = body.Sections.filter(section => {return section.SectionID;});
        req.App.api.get('/getAssignments/' + req.params.Id, (err, statusCode, assignmentsBody) => {
            let assignmentsArray = [];

            assignmentsArray =  assignmentsBody.Assignments;
            var sectionList = [];
            var apiCalls = {};
            let sectionAssignmentsCalls = {};

            for (var i=0; i<body.Sections.length; i++){

                sectionList.push(body.Sections[i]);
                sectionAssignmentsCalls[body.Sections[i].SectionID] = req.App.api.get.bind(this, '/getActiveAssignmentsForSection/' + body.Sections[i].SectionID);
                apiCalls[body.Sections[i].SectionID] = req.App.api.get.bind(this,'/course/getsection/' + body.Sections[i].SectionID);

            }

            async.parallel(apiCalls, (err, results)=>{
                async.parallel(sectionAssignmentsCalls, (err2,assignmentResults) => {
                    for(var i=0; i<sectionList.length; i++){
                        var currentSectionId = sectionList[i].SectionID;
                        sectionList[i].members=results[currentSectionId][1].UserSection;
                        sectionList[i].assignments = assignmentResults[currentSectionId][1].Assignments;

                    }
                    console.log(sectionList);

                    res.render('course_page', {
                        showHeader:false,
                        sectionList: sectionList,
                        courseID: req.params.Id,
                        assignmentsList: assignmentsArray,
                        instructor: (req.App.user.type == 'teacher' ||  req.App.user.type == 'instructor') ? true : false,
                        courseTitle: body.Course.Name,
                        courseNumber: body.Course.Number,
                        courseDescription: body.Course.Description
                    });

                });
            });
        });
    });
};
