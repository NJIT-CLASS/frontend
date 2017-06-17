exports.get = (req, res) => {
    if( req.App.user === undefined){
        res.redirect('/');
        return;

    }

    req.App.api.get('/getAssignmentFinalGrades/' + req.params.Id, (err, statusCode, body) => {
        var userList = [];
        var ai = '';
        var userTaskList = [];
        var qualityGradeTasks = [];
        var simpleGradeTasks = [];
        var nonGradeTasks = [];
        var pendingTasks = [];
        var qualityGradeECTasks = [];
        var simpleGradeECTasks = [];
        var nonGradeECTasks = [];
        var pendingECTasks = [];

        ai = body.AssignmentInstance;
        if(ai === undefined){
            return res.render('gradeReport', {
                ai: ai,
                userList: [],
                userTaskList: []
            });

        }

//instructor loop
        for(var i=0; i<body.AssignmentInstance.SectionUsers.length; i++){
            userList.push(body.AssignmentInstance.SectionUsers[i]);
        }
/**/
//student loop
        for(var i=0; i<body.AssignmentInstance.SectionUsers.length; i++){
            if(body.AssignmentInstance.SectionUsers[i] == req.App.user.userId)
                for(var w=0; w<body.AssignmentInstance.SectionUsers[i].assignmentGrade.WorkflowActivityGrades.length; w++){
                    for(var t=0; t<body.AssignmentInstance.SectionUsers[i].assignmentGrade.WorkflowActivityGrades[w].WorkflowActivity.users_WA_Tasks.length; t++){
                        userTaskList.push(body.AssignmentInstance.SectionUsers[i].assignmentGrade.WorkflowActivityGrades[w].WorkflowActivity.users_WA_Tasks[t]);
                    }
                }

        }

        res.render('gradeReport', {
            ai: ai,
            userList: userList,
            userTaskList: userTaskList
        });
        return;
    });






};
