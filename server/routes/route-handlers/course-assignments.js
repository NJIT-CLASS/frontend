exports.get = (req, res) => {
    let assignmentsArray = [];
    req.App.api.get('/getAssignments/' + req.params.courseId, (err, statusCode, body) => {

        assignmentsArray =  body.Assignments;
        res.render('course-assignments', {
            assignmentsList: assignmentsArray,
            courseID: req.params.courseId
        });

    });
};
