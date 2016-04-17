const async = require('async');

exports.get = (req, res) => {
    req.App.api.get('/course/' + req.params.Id, (err, statusCode, body) =>{ 
        var sectionList = [];
        var apiCalls = {};
        for (var i=0; i<body.Sections.length; i++){
            sectionList.push(body.Sections[i]);

            apiCalls[body.Sections[i].SectionID] = ((Sections) => {
                return (callback)=> {
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
};
