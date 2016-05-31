exports.get = (req, res) => {
    req.App.api.get('/getCourseCreated/' + req.App.user.userId, (err, statusCode, body) => {
        var courseList = [];
        for(var i=0; i<body.Courses.length; i++){
            courseList.push(body.Courses[i]);
        }

        req.App.api.get('/getPendingTasks/' + req.App.user.userId, (err,statusCode,body) => { /* need to make this new APi get tasks*/

          var pendingTasksList = [];

          if(body.PendingTasks == null){ //PendingTasks defined in backend Rest.js
            res.render('dashboard', {
              courseList: courseList,
              pendingTasksList: pendingTasksList //empty
            });
          }

          for(var i=0; i<body.PendingTasks.length; i++){
              pendingTasksList.push(body.PendingTasks[i]);
          }

          res.render('dashboard', {
            courseList: courseList,
            pendingTasksList: pendingTasksList //empty
          });

        });
      });




}
