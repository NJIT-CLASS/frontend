exports.get = (req, res) => {
    req.App.api.get('/getCourseCreated/' + req.App.user.userId, (err, statusCode, body) => {
        var courseList = [];
        for(var i=0; i<body.Courses.length; i++){
            courseList.push(body.Courses[i]);
        }

        req.App.api.get('/getPendingTasks/' + req.App.user.userId, (err,statusCode,bod) => { /* need to make this new APi get tasks*/
          req.App.api.get('/getCompletedTasks/' + req.App.user.userId, (err,statusCode,bo) => {
            var pendingTasksList = [];
            var completedTasksList = [];
            if(bod.PendingTasks == null){ //PendingTasks defined in backend Rest.js
              res.render('dashboard', {
                courseList: courseList,
                pendingTasksList: pendingTasksList, //empty
                completedTasksList: completedTasksList 
              });
            }

            for(var i=0; i<bod.PendingTasks.length; i++){
                pendingTasksList.push(bod.PendingTasks[i]);
            }
            for(var i=0; i<bo.CompletedTasks.length; i++){
                completedTasksList.push(bo.CompletedTasks[i]);
            }

            res.render('dashboard', {
              courseList: courseList,
              pendingTasksList: pendingTasksList,
              completedTasksList: completedTasksList //empty
            });
          });
        });
      });




}
