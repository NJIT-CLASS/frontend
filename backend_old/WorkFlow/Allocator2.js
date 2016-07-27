var models = require('../Model');
var User = models.User;
var UserLogin = models.UserLogin;
var UserContact = models.UserContact;
var Course = models.Course;
var Section = models.Section;
var SectionUser = models.SectionUser;

var Semester = models.Semester;
var TaskInstance = models.TaskInstance;
var TaskActivity = models.TaskActivity;
var Assignment = models.Assignment;
var AssignmentInstance = models.AssignmentInstance;

var WorkflowInstance = models.WorkflowInstance;
var WorkflowActivity = models.WorkflowActivity;
var ResetPasswordRequest = models.ResetPasswordRequest;


function Allocator2() {

};
//-------------------------------------------------------------------------------------

Allocator2.prototype.getAssignmentsFromAcitivity = function() {
    var assignments = [];

    Assignment.findAll().then(function(results) {
        for (assignment in results) {
            assignments.push(assignment.AssignmentID);
        }

        console.log(assignments);

    }).catch(function(err) {
        console.log(err);
    });

    return assignments;
}


//-------------------------------------------------------------------------------------

Allocator2.prototype.getWorkflowsFromActivity = function(a_id) {
        var workflows = [];

        WorkflowActivity.findAll({
            where: {
                AssignmentID: a_id
            }
        }).then(function(results) {
            for (workflow in results) {
                workflows.push(workflow.WorkflowActivityID);
            }

            console.log(workflows);

        }).catch(function(err) {
            console.log(err);
        });

        return workflows;
    }
    //-------------------------------------------------------------------------------------

Allocator2.prototype.getWorkflowInstances = function(a_id) {
    var workflows = [];

    WorkflowInstance.findAll({
        where: {
            AssignmentID: a_id
        }
    }).then(function(results) {
        for (workflow in results) {
            workflows.push(workflow.WorkflowInstanceID);
        }

        console.log(workflows);

    }).catch(function(err) {
        console.log(err);
    });

    return workflows;

}

//-------------------------------------------------------------------------------------

Allocator2.prototype.getTasksFromActivity = function(wa_id) {
    var tasks = {};

    TaskActivity.findAll({
        where: {
            WorkflowActivityID: wa_id
        }
    }).then(function(results) {
        for (task in results) {
            //tasks.push(task.TaskActivityID);
            tasks[task.VisualID] = task.TaskActivityID
        }

        console.log(tasks);

    }).catch(function(err) {
        console.log(err);
    });

    return tasks;
}


//-------------------------------------------------------------------------------------

Allocator2.prototype.getTaskInstances = function(wi_id) {
    var tasks = [];
    TaskInstance.findAll({
        where: {
            WorkflowInstanceID: wi_id
        }
    }).then(function(results) {
        for (task in results) {
            tasks.push(task.TaskInstanceID);
        }

        console.log(tasks);

    }).catch(function(err) {
        console.log(err);
    });

    return tasks;
}


//-------------------------------------------------------------------------------------

Allocator2.prototype.updateUH = function(taskid, newUser) {
    var newUH = [];
    var UserHistory = [];

    TaskInstance.findAll({
        where: {
            TaskInstanceID: taskid
        }
    }).then(function(results) {
        for (task in results) {
            UserHistory.push(task.UserHistory);
        }
    }).catch(function(err) {
        console.log(err);
    });

    if (UserHistory === null || typeof UserHistory === 'undefined') {
        //If UserHistory is null update the UserHistory

        newUH.push({
            'regular': newUser
        });


        TaskInstance.Update({
            UserHistory: JSON.stringify(newUH)
        }, {
            where: {
                TaskInstanceID: taskid
            }
        }).catch(function(err) {
            console.log(err);
        });

    } else {
        aJson = JSON.parse(UserHistory)

        for (j in aJson) {
            newUH.push(j);
        }

        newUH.push({
            'regular': newUser
        });

        TaskInstance.Update({
            UserHistory: JSON.stringify(newUH)
        }, {
            where: {
                TaskInstanceID: taskid
            }
        }).catch(function(err) {
            console.log(err);
        });

        console.log(UserHistory);

    }
}

//-------------------------------------------------------------------------------------

Allocator2.prototype.updateUSER = function(taskid, newUser) {
    TaskInstance.Update({
        UserID: newUser
    }, {
        where: {
            TaskInstanceID: taskid
        }
    }).catch(function(err) {
        console.log(err);
    });
}

//-------------------------------------------------------------------------------------


Allocator2.prototype.getStudents = function(sectionid) {

    var shuffle = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    SectionUser.findAll({
        where: {
            SectionID: sectionid
        }
    }).then(function(results) {
        shuffle(results);

        console.log(results);

        return results;
    }).catch(function(err) {
        console.log(err);
    });


}

//-------------------------------------------------------------------------------------

Allocator2.prototype.inArray = function(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

//-------------------------------------------------------------------------------------
Allocator2.prototype.allocate = function() {

    var assignments = this.getAssignmentsFromAcitivity();
    var allocation = {};

    for (a_id in assignments) {

        var workflowActivities = this.getWorkflowsFromActivity(a_id);
        var workflowInstances = this.getWorkflowInstances(a_id);
        var students = this.getStudents(sectionid);


        for (wa_id in workflowActivities) {
            var taskActivities =  new Array();
            taskActivities[wa_id] = this.getTaskInstances(wa_id);

            for (workflow in workflowInstances) {

                var taskInstances = this.getTaskInstances(workflow);
                var temp = students.pop();
                students.unshift(temp);
                var i = 0;
                temp = taskActivities[wa_id];

                for (ta_id in taskInstances) {

                    TA_id = temp.shift();

                    TaskActivity.findAll({
                        where: {
                            TaskActivityID: TA_id
                        }
                    }).then(function(results) {
                        for (result in results) {
                            var aJson = JSON.parse(result.AssigneeConstraints);
                            var aConst = aJson['constraints'];
                            var aRole = aJson['role'];

                            if (aRole === 'nobody') {
                                allocation[workflow][result.VisualID] = 0;
                                var user = allocation[workflow][result.VisualID];

                                this.updateUSER(ta_id, user);
                            } else if (aRole === 'instructor') {
                                allocation[workflow][result.VisualID] = 1111;
                                var user = allocation[workflow][result.VisualID];

                                this.updateUSER(ta_id, user);
                            } else {
                                if (aConst.hasOwnProperty('same as')) {
                                    allocation[workflow][result.VisualID] = allocation[workflow][aConst['same as']];
                                    var id = allocation[workflow][aConst['same as']];
                                    this.updateUSER(ta_id, id);
                                    this.updateUH(ta_id, id);

                                } else if (aConst.hasOwnProperty('not')) {
                                    notThese = aConst['not'];
                                    avoidThese = [];
                                    chooseMe = [];

                                    for (vid in notThese) {
                                        avoidThese.push(allocation[workflow][vid]);
                                    }

                                    for (st in students) {
                                        if (!inArray(st, avoidThese)) {
                                            chooseMe.push(st);
                                        }
                                    }

                                    allocation[workflow][result.VisualID] = chooseMe[0];
                                    var id = chooseMe[0];
                                    this.updateUSER(ta_id, id);
                                    this.updateUH(ta_id, id);

                                } else if (aConst.hasOwnProperty('new to subwf')) {

                                    allocation[workflow][result.VisualID] = student[i];
                                    var id = student[i];
                                    this.updateUSER(ta_id, id);
                                    this.updateUH(ta_id, id);
                                } else if (aConst.hasOwnProperty('new to wf')) {

                                    allocation[workflow][result.VisualID] = student[i];
                                    var id = student[i];
                                    this.updateUSER(ta_id, id);
                                    this.updateUH(ta_id, id);
                                } else {
                                    allocation[workflow][result.VisualID] = student[i];
                                    var id = student[i];
                                    this.updateUSER(ta_id, id);
                                    this.updateUH(ta_id, id);
                                }
                            }
                        }
                        i++;
                    }).catch(function(err) {
                        console.log("DB Error: could not query the database");
                    });


                }
            }
        }
    }

    console.log(allocation);
}

module.exports.Allocator2 = Allocator2;
