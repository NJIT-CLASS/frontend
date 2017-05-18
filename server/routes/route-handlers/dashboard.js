exports.get = (req, res) => {
    if( req.App.user === undefined){
        res.redirect('/');
        return;

    }

    req.App.api.get('/course/getCourses/' + req.App.user.userId, (err, statusCode, body) => {
        var courseList = [];
        var completedTasksList = [];
        var pendingTasksList = [];

        for(var i=0; i<body.Courses.length; i++){
            courseList.push(body.Courses[i]);
        }

        req.App.api.get('/getPendingTaskInstances/' + req.App.user.userId, (err1,statusCode1,bod) => {


            if(statusCode1 == 404){
                res.render('dashboard', {
                    courseList: courseList,
                    pendingTasksList: pendingTasksList, //empty
                    completedTasksList: completedTasksList
                });
                return;
            }

            for(var i=0; i<bod.PendingTaskInstances.length; i++){
                pendingTasksList.push(bod.PendingTaskInstances[i]);
            }

           /* need to make this new APi get tasks*/
            req.App.api.get('/getCompletedTaskInstances/' + req.App.user.userId, (err2,statusCode2,bo) => {

                if(statusCode2 == 404){
                    res.render('dashboard', {
                        courseList: courseList,
                        pendingTasksList: pendingTasksList,
                        completedTasksList: completedTasksList
                    });
                    return;
                }


                if(bod.PendingTaskInstances == null || bod.PendingTaskInstances == undefined){ //PendingTasks defined in backend Rest.js
                    res.render('dashboard', {
                        courseList: courseList,
                        pendingTasksList: pendingTasksList, //empty
                        completedTasksList: completedTasksList
                    });
                    return;
                }


                for(var i=0; i<bo.CompletedTaskInstances.length; i++){
                    completedTasksList.push(bo.CompletedTaskInstances[i]);
                }

                res.render('dashboard', {
                    courseList: courseList,
                    pendingTasksList: pendingTasksList,
                    completedTasksList: completedTasksList //empty
                });
                return;
            });
        });
    });




};
