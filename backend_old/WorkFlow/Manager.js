var models = require('../Model');
var TaskFactory = require('./TaskFactory.js');
var Allocator = require('./Allocator.js');

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



/**
 *
 * @constructor
 */

function Manager() {

};

//   for(var task in tasks)
//      Manager.checkTimeoutTaskInstance(task);
//     test = TaskInstance.queryByStatus(1);

Manager.checkTimeoutTaskInstances = function() {
    TaskInstance.findAll({
        where: {
            $or: [{
                Status: "triggered"
            }, {
                Status: "started"
            }]
        }
    }).then(function(tasks) {
        tasks.forEach(function(task) {
            Manager.checkTimeoutTaskInstance(task);
        });


    });
}


Manager.checkTimeoutTaskInstance = function(task) {


    task.timeoutTime(function(date) {

            var now = new Date();
            if (date < now) {
                task.timeOut();
            }
        })
        /*//  console.log("Calling CheckOutTaks Function");
          //task.timeOut();
          test = {type: "task status", 'task type' : "create problem" , "task status" : "triggered"};
         // task.addTriggerCondition(test);


           //       task.complete();*/
}


Manager.checkTaskInstances = function() {
    TaskInstance.findAll({
        where: {
            $or: [{
                Status: "not triggered"
            }, {
                Status: "triggered"
            }, {
                Status: "started"
            }]
        }
    }).then(function(tasks) {
        tasks.forEach(function(task) {
            Manager.checkTaskInstance(task);
        });


    });
}

Manager.checkTaskInstance = function(task) {
    task.triggerConditionsAreMet(function(result) {
        if (result)
            task.trigger();
    });

    task.expireConditionsAreMet(function(result) {
        if (result)
            task.expire();
    });
}

Manager.checkAssignments = function() {
    AssignmentInstance.findAll({
        where: {
            EndDate: null
        }
    }).then(function(assignmentInstances) {
        assignmentInstances.forEach(function(assignmentInstance) {
            Manager.checkAssginment(assignmentInstance);
        });


    });

}

Manager.checkAssginment = function(assignmentInstance) {
    var startDate = assignmentInstance.StartDate;

    var now = new Date();

    if (startDate < now) {
        Manager.isStarted(assignmentInstance, function(result) {
            if (result)
                Manager.trigger(assignmentInstance);
        });
    }

}
Manager.isStarted = function(assignmentInstance, callback) {
    WorkflowInstance.count({
        where: {
            AssignmentID: assignmentInstance.AssignmentID
        }
    }).then(function(count) {
        callback(count > 0 ? true : false);
    });
}

/**
 * Returns the assignment based on the assignment section
 * @param assignmentInstance
 */
Manager.getAssignments = function(assignmentInstance) {
    return Assignment.findById(assignmentInstance.AssignmentID).then(function(assignment) {
        return assignment;
    });
}

/**
 * Returns the list of users assigne to the section
 * @param assignmentInstance
 */
Manager.getUserSection = function(assignmentInstance) {
    return SectionUser.findAll({
        where: {
            SectionID: assignmentInstance.SectionID,
            UserStatus: 'Active',
            UserRole: 'Student'
        },
        include: [{
            model: User
        }]
    }).then(function(assignment) {
        return assignment;
    });
}

/**
 * reutrning the workflow activity 1.
 * We need to find a way to get the Workflow activity in general
 * from the assignment or section some how.
 */
Manager.getWorkflowActivity = function() {
    return WorkflowActivity.findById(1).then(function(workflowActivity) {
        return workflowActivity;
    });
}


/**
 * Triggers when the start date has been reached fro the adssignment instance(assgnment section)
 * @param assignmentInstance
 */
Manager.trigger = function(assignmentInstance) {



    Promise.all([Manager.getAssignments(assignmentInstance), Manager.getUserSection(assignmentInstance), this.getWorkflowActivity()]).then(function(result) {
        var assignment = result[0];
        var S_User = result[1];
        var workflowActivity = result[2];

        for (var i = 0; i < S_User.length; i++) {
            var sectionUser = S_User[i];


            /**
             * Creating each workflowInstance
             */
            var workflowInstance = WorkflowInstance.build({
                //Type: workflowActivity.Name,
                StartTime: new Date(),
                EndTime: assignmentInstance.EndDate,
                AssignmentInstanceID: assignmentInstance.AssignmentInstanceID,
                WorkflowActivityID: workflowActivity.WorkflowActivityID,
                TaskCollection: JSON.parse("{}"),
                Data: JSON.parse("{}")
            });


            Promise.all([
                workflowInstance.save().then(function(workflow) {
                    return workflow;
                }),
                Manager.getTaskActivity(workflowActivity.WorkflowActivityID, assignment)
            ]).then(function(result) {


                /**
                 * Creating task for each workflowInstance
                 */
                var workflowInstance = result[0];
                var taskActivities = result[1];

                var promisesArray = [];
                for (var i = 0; i < taskActivities.length; i++) {
                    var currentTaskActivity = taskActivities[i];
                    var task = TaskInstance.build({
                        UserID: sectionUser.UserID,
                        TaskActivityID: currentTaskActivity.TaskActivityID,
                        WorkflowInstanceID: workflowInstance.WorkflowInstanceID,
                        AssignmentInstanceID: assignmentInstance.AssignmentInstanceID,
                        Status: "Incomplete",
                        StartDate: workflowInstance.StartTime,
                        EndDate: workflowInstance.EndTime,
                        Data: JSON.parse("{}"),
                        UserHistory: null,
                        FinalGrade: null,
                        Files: JSON.parse("{}"),
                        ReferencedTask: null,
                        NextTasks: null,
                        PreviousTasks: null,
                        EmailLastSent: null

                    });

                    /**
                     * Adding promises to the array
                     */
                    promisesArray.push(task.save().then(function(task) {
                        console.log("task created");
                    }));

                }


                Promise.all(promisesArray).then(function(result) {

                    /**
                     * Once the tasks are created
                     * we will allocate them to the students
                     */
                    var alloc = new Allocator.Allocator();
                    alloc.Allocate([assignmentInstance.AssignmentID], [assignmentInstance.SectionID]);
                });



            });
            /*workflowInstance.save().bind([assignment,S_User]).then(function(workflow)
            {
                console.log("Workflow saved");

                Manager.triggerTaskCreation(workflow,this[0],this[1],Manager.);

            }).catch(function(e){
                console.log(e);

            });*/

        }




    });
}

/**
 * Create tasks for the TaskActivities
 */
Manager.getTaskActivity = function(workflowActivityID, assignment) {
    return TaskActivity.findAll({
        where: {
            WorkflowActivityID: workflowActivityID,
            AssignmentID: assignment.AssignmentID
        }
    }).then(function(taskActivities) {
        return taskActivities;
    });
}
Manager.notifyUser = function(event, task) {
    //Waiting for email sending piece from Christian
}


Manager.CrateTaskFromTaskAcivity = function(workflowInstance) {

}

Manager.triggerTaskCreation = function(workflowInstance, assignment, users, tasks) {
    var factory = new TaskFactory.TaskFactory(workflowInstance, tasks);
    factory.createTaskInstances();
}


/**
 * Get the workflowInstance tasks
 *
 * @return array
 */
Manager.getTaskInstances = function(assignmentInstance) {
    return TaskInstance.findAll({
        where: {
            AssignmentID: assignmentInstance.AssignmentID
        }
    }).then(function(tasks) {
        return tasks;
    });
}

/**
 * Resolve a Human TaskInstance Name
 *
 * @return string The Human Version of the Type
 * @param string The type
 */

//Should from database
Manager.humanTaskInstance = function(type) {
    var action_human = '';
    switch (type) {
        case 'create problem':
            action_human = 'Create a Problem';
            break;
        case 'edit problem':
            action_human = 'Edit a Problem';
            break;

        case 'grade solution':
            action_human = 'Grade a Solution';
            break;

        case 'create solution':
            action_human = 'Create a Solution';
            break;

        case 'resolution grader':
            action_human = 'Resolve Grades';
            break;
        case 'dispute':
            action_human = 'Decide Whether to Dispute';
            break;
        case 'resolve dispute':
            action_human = 'Resolve Dispute';
            break;
        default:
            action_human = 'Unknown Action';
    }
    return action_human;
}

/**
 * Retrieve the roles a user can have in a section
 *
 * @return Array
 */
Manager.getUserRoles = function() {
    return ['student', 'instructor'];
}

module.exports.Manager = Manager;
