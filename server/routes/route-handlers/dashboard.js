exports.get = (req, res) => {
    req.App.api.get('/getCourseCreated/' + req.App.user.userId, (err, statusCode, body) => {
        var courseList = [];
        for(var i=0; i<body.Courses.length; i++){
            courseList.push(body.Courses[i]);
        }

        res.render('dashboard', {
            courseList: courseList 
        });
    });
};