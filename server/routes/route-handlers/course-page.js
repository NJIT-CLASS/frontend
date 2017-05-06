const async = require('async');

exports.get = (req, res) => {
    if(req.App.user === undefined){
        return res.redirect(`/?url=${encodeURIComponent(req.originalUrl)}`);
    }
    console.log(req.App);
    let coursesUrl = '/course/';
    if(req.App.user.role === 'student'){
        coursesUrl = '/getActiveEnrolledCourses/';
    }
    req.App.api.get(coursesUrl + req.params.Id, (err, statusCode, body) =>{
        let assignmentsArray = [];
        req.App.api.get('/getAssignments/' + req.params.Id, (err, statusCode, assignmentsBody) => {

            assignmentsArray =  assignmentsBody.Assignments;
            var sectionList = [];
            var apiCalls = {};
            for (var i=0; i<body.Sections.length; i++){
                sectionList.push(body.Sections[i]);

                apiCalls[body.Sections[i].SectionID] = ((Sections) => {
                    return (callback)=> {
                        req.App.api.get('/course/getsection/' + Sections.SectionID, (err, statusCode, bod) =>{
                            var sectionMembers = bod.UserSection;
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
                    };
                })(body.Sections[i]);
            }

            async.parallel(apiCalls, (err, results)=>{
                for(var i=0; i<sectionList.length; i++){
                    var currentSectionId = sectionList[i].SectionID;
                    sectionList[i].members=results[currentSectionId];
                }

                req.App.api.get('/getActiveAssignments/' + req.params.Id, (err, statusCode, assignmentInstances) =>{

                    res.render('course_page', {
                        showHeader:false,
                        sectionList: sectionList,
                        activeAssignments: assignmentInstances.Assignments,
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
