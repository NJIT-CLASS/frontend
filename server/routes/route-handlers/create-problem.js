exports.get = (req, res) => {/*
  req.App.api.get('/create-problem/'+req.App.user.userID)
    res.render('create-problem',{
      TaskType=TaskActivity.type,
      AssignmentName=Assignment.Title,
      CourseName=Course.Name,
      SemesterName=Semester.Name,
      AssignmentDescription=Assignment.Description
    });*/
    res.render('createproblem');
};

/* Incomplete*/
