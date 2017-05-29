'use strict';

var async = require('async');

exports.get = function (req, res) {
    if (req.App.user === undefined) {
        return res.redirect('/?url=' + encodeURIComponent(req.originalUrl));
    }
    var coursesUrl = '/course/';
    req.App.api.get(coursesUrl + req.params.Id, function (err, statusCode, body) {
        var sectionIDsArray = body.Sections.filter(function (section) {
            return section.SectionID;
        });

        req.App.api.get('/getAssignments/' + req.params.Id, function (err, statusCode, assignmentsBody) {
            var assignmentsArray = [];
            req.App.api.get('/partialAssignments/all/' + req.App.user.userId + '?courseId=' + req.params.Id, function (err, statusCode, partialAssignmentsBody) {

                assignmentsArray = assignmentsBody.Assignments;
                var sectionList = [];
                var apiCalls = {};
                var sectionAssignmentsCalls = {};

                for (var i = 0; i < body.Sections.length; i++) {

                    sectionList.push(body.Sections[i]);
                    sectionAssignmentsCalls[body.Sections[i].SectionID] = req.App.api.get.bind(undefined, '/getActiveAssignmentsForSection/' + body.Sections[i].SectionID);
                    apiCalls[body.Sections[i].SectionID] = req.App.api.get.bind(undefined, '/course/getsection/' + body.Sections[i].SectionID);
                }

                async.parallel(apiCalls, function (err, results) {
                    async.parallel(sectionAssignmentsCalls, function (err2, assignmentResults) {
                        for (var i = 0; i < sectionList.length; i++) {
                            var currentSectionId = sectionList[i].SectionID;
                            sectionList[i].members = results[currentSectionId][1].UserSection;
                            sectionList[i].instructors = results[currentSectionId][1].UserSection.filter(function (member) {
                                return member.Role === 'Instructor';
                            });
                            sectionList[i].students = results[currentSectionId][1].UserSection.filter(function (member) {
                                return member.Role === 'Student';
                            });
                            sectionList[i].observers = results[currentSectionId][1].UserSection.filter(function (member) {
                                return member.Role === 'Observer';
                            });
                            sectionList[i].assignments = assignmentResults[currentSectionId][1].Assignments;
                        }
                        var isInstructor = req.App.user.type == 'teacher' || req.App.user.type == 'instructor' ? true : false;
                        var isAdmin = req.App.user.admin;
                        var instructOrAdmin = isInstructor || isAdmin;
                        res.render('course_page', {
                            showHeader: false,
                            sectionList: sectionList,
                            courseID: req.params.Id,
                            partialAssignments: partialAssignmentsBody.PartialAssignments,
                            assignmentsList: assignmentsArray,
                            instructor: isInstructor,
                            admin: req.App.user.admin,
                            instructorOrAdmin: instructOrAdmin,
                            courseTitle: body.Course.Name,
                            courseNumber: body.Course.Number,
                            courseDescription: body.Course.Description
                        });
                    });
                });
            });
        });
    });
};