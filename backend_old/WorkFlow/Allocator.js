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


/**
 *
 * @constructor
 */
function Allocator() {
    /**
     * Get the workflows base in the asignment ID.
     * It pulls also the Tasks, and TaskActivities..
     * @param assignment
     * @returns {*}
     */
    this.getWorkflowInstances = function(assignment) {

        return WorkflowInstance.findAll({
            where: {
                AssignmentID: assignment
            },
            include: [{
                model: TaskInstance,
                as: 'TaskInstances',
                include: [{
                    model: TaskActivity
                }]
            }]
        }).then(function(workflows) {
            return workflows;
        });

    }

    /**
     * Get the workflows base in the asignment ID.
     * It pulls also the Tasks, and TaskActivities..
     * @param assignment
     * @returns {*}
     */
    this.getWorkflowActivities = function(assignment) {

            return WorkflowActivity.findAll({
                where: {
                    WorkflowActivityID: assignment
                },
                include: [{
                    model: WorkflowInstance,
                    as: 'WorkflowInstances',
                    include: [{
                        model: TaskInstance,
                        as: 'TaskInstances',
                        include: [{
                            model: TaskActivity
                        }]
                    }]
                }] /*,  include : [  { model : WorkflowInstance, as: 'WorkflowInstances'}]*/
            }).then(function(workflows) {
                return workflows;
            });
            /*.catch(function (e)
                    {
                        console.log(e);
                    });*/

        }
        /**
         * this method gets the list of sectionUsers with the User object
         * base on the section ID.
         * @param sectionID
         * @returns {*}
         */
    this.getStudents = function(sectionID) {
        //var options = {include : [User], where : ['User.UserType = ?','Student']};
        return SectionUser.findAll({
            where: {
                SectionID: sectionID
            },
            include: [{
                model: User
            }]
        }).then(function(users) {
            return users;
        });
    }

    /**
     *
     * @param workflow
     * @param binding
     * @returns {*}
     */
    this.getTaskInstances = function(workflow, binding) {
        return TaskInstance.findAll({
            where: {
                WorkflowInstanceID: workflow
            }
        }).bind(binding).then(function(tasks) {
            return [this, tasks];
        });;
    }


    /**
     * This function returns the Instructor in the students list
     * The instructor will be deleted from the list
     * Make sure this is correct
     * TEST IT!!!!!!!!!!!!!!
     * @param Users
     * @returns {*}
     */
    this.getInstructorFromUserList = function(Users) {
        for (var i = 0; i < Users.length; i++) {
            if (Users[i].UserRole == 'Instructor') {
                var instructor = Users[i];
                Users.splice(i, 1);
                return instructor.UserID;
            }
        }
    }

    /**
     * Assigning the User ID to the given task
     * @param Task
     * @param userID
     * @constructor
     */
    this.UpdateUser = function(TaskInstance, userID) {
        TaskInstance.UserID = userID;
        TaskInstance.save().then(function() {
            console.log('User ID assigned to TaskInstance');
        }).catch(function(e) {
            console.log(e);
        });

    }

    //updateUH($ta_id, $newUser)

    /**
     * This method will update the history for the given task
     * @param Task current Task
     * @param newUser User ID to add to the history
     * @constructor
     */
    this.UpdateUH = function(TaskInstance, newUser) {

        var newUH = [];
        /**
         * Checking if the user_history exists or not.
         */
        if (typeof TaskInstance.UserHistory === 'undefined' || TaskInstance.UserHistory == null) {
            var UserHistory;
            var arr = {
                'regular': newUser
            };
            //arr['regular'] =  newUser;
            newUH.push(arr);

            //var content = JSON.parse(newUH);

            /**
             * Updating user_history
             */
            TaskInstance.UserHistory = JSON.stringify(newUH);

            /**
             * Saving in the Database
             */
            TaskInstance.save().then(function() {
                console.log("Saving User History in task");
            });
        } else {
            var aJson = JSON.parse(TaskInstance.UserHistory.toString());

            for (var i = 0; i < aJson.length; i++) {
                newUH.push(aJson[i]);
            }

            var arr = {
                'regular': newUser
            };

            newUH.push(arr);
            TaskInstance.UserHistory = JSON.stringify(newUH);

            TaskInstance.save().then(function() {
                console.log("Saving user_history in task");
            });


        }
    }
}


/**
 *
 * @param assignments array with all the assignments
 * @constructor
 */
Allocator.prototype.Allocate = function(assignments, section) {
    //var allocation = {};

    var allocator = this;
    for (var i = 0; i < assignments.length; i++) {
        Promise.all([this.getWorkflowActivities(assignments[i]), this.getStudents(section[i])]).then(function(results) {
            console.log(results)

            /**
             * result[0] is the workflows by the assignmentID
             * result[1] is the studetn list based on the section
             */

            var workflowsActivities = results[0];
            var Students = results[1];

            /**
             * Removing the instructor from the list and
             * keeping instructor ID
             */
            var instructorID = allocator.getInstructorFromUserList(Students);

            for (var i = 0; i < workflowsActivities.length; i++) {

                /**
                 * Holding the list of workflows for the current WorkflowActivity
                 */
                var workflows = workflowsActivities[i].WorkflowInstances;

                /*
                 * Holding the allocation for the current workflowActivity
                 */
                var allocation = new Array(workflows.length);
                for (var w = 0; w < workflows.length; w++) {
                    var w_id = workflows[w].WorkflowInstanceID;
                    var TaskInstances = workflows[w].TaskInstances;

                    //for each workflow instance, the last student in the array will be move all the way up to
                    // be at index = 0. This way students will get the same amount of tasks per assignment.
                    var s = Students.length;
                    var tempStudent = Students[s - 1];
                    Students.splice(s - 1, 1);
                    Students.unshift(tempStudent);


                    if (typeof allocation[w] === 'undefined')
                        allocation[w] = {};


                    /**
                     * Here we will be going through each TaskInstance
                     */
                    var stCounter = 0;
                    for (var t = 0; t < TaskInstances.length; t++) {

                        var taskActivity = TaskInstances[t].TaskActivity;

                        /**
                         * Retrieving constrains information
                         */
                        var aJson = JSON.parse(taskActivity.AssigneeConstraints.toString());
                        var aConst = aJson.constraints;
                        var aRole = aJson.role;


                        if (aRole == 'nobody') {
                            /**
                             * User ID : 8 is nobody by default in the current users table
                             */
                            allocation[w][taskActivity.VisualID] = 8;
                            var user = allocation[w][taskActivity.VisualID];
                            allocator.UpdateUser(TaskInstances[t], 8);

                        } else if (aRole == 'instructor') {
                            allocation[w][taskActivity.VisualID] = instructorID;

                            var user = allocation[w][taskActivity.VisualID]
                            allocator.UpdateUser(TaskInstances[t], user);
                        } else {
                            if (typeof aConst !== 'undefined' && aConst != null && typeof aConst['same as'] !== 'undefined') {

                                allocation[w][taskActivity.VisualID] = allocation[w][aConst['same as']];
                                var id = allocation[w][aConst['same as']];

                                allocator.UpdateUser(TaskInstances[t], id);
                                allocator.UpdateUH(TaskInstances[t], id);
                            } else if (typeof aConst !== 'undefined' && aConst != null && typeof aConst['not'] !== 'undefined') {
                                var notThese = aConst['not'];
                                var avoidThese = [];
                                var ChooseMe = [];


                                var visual = {};
                                var alloc = {};

                                for (var i = 0; i < notThese.length; i++) {
                                    var vid = notThese[i];
                                    avoidThese.push(allocation[w][vid]);
                                }


                                for (var i = 0; i < Students.length; i++) {
                                    var st = Students[i].UserID;
                                    if (avoidThese.indexOf(st) == -1)
                                        ChooseMe.push(st);
                                }

                                allocation[w][taskActivity.VisualID] = ChooseMe[0];
                                var id = ChooseMe[0];

                                allocator.UpdateUser(TaskInstances[t], id);
                                allocator.UpdateUH(TaskInstances[t], id);

                            } else if (typeof aConst !== 'undefined' && aConst != null && typeof aConst['new to subwf'] !== 'undefined') {
                                allocation[w][taskActivity.VisualID] = Students[stCounter].UserID;
                                var id = Students[stCounter].UserID;;

                                allocator.UpdateUser(TaskInstances[t], id);
                                allocator.UpdateUH(TaskInstances[t], id);

                            } else if (typeof aConst !== 'undefined' && aConst != null && typeof aConst['new to wf'] !== 'undefined') {
                                allocation[w][taskActivity.VisualID] = Students[stCounter].UserID;
                                var id = Students[stCounter].UserID;;

                                allocator.UpdateUser(TaskInstances[t], id);
                                alloc.UpdateUH(TaskInstances[t], id);
                            } else {
                                allocation[w][taskActivity.VisualID] = Students[stCounter].UserID;
                                var id = Students[stCounter].UserID;

                                allocator.UpdateUser(TaskInstances[t], id);
                                allocator.UpdateUH(TaskInstances[t], id);
                            }

                        }


                    }
                    stCounter++;
                }
            }

            /**
             * Executing All Promises for each task
             */
            /*Promise.all(tasksP).then(function(result) {
                console.log(result);
                /!**
                 * Now we have all the information together
                 * we can now loop through each task to allocate
                 * result[][0] WorkflowInstances
                 * result[][1] Students
                 * result[][2] index
                 *!/


            });*/
        });
    }
    /*var allocation = [];
 for (var  i = 0; i < assignments.length; i++)
 {
 this.getWorkflowInstances(assignments[i], function(assignment,workflows)
 {
 this.getStudents(assignment, workflows,function(assignment, workflows,users)
 {
 for(var i = 0; i < workflows.length; i++)
 {
 this.getTasks(assignment, workflows[i],users,function(assignment, workflows,users,tasks){
 var i = users.length
 while (--i !== 0) {
 users[0].unshift(users[i])
 }

 var taskActiit

 });
 }
 });

 });
 }*/
}

/*
Allocator.prototype.shift = function(a)
{
    if(count(a) == 1)
        return a;

    var rememberMe = a[0];

    for( i = 0; i < count(a) - 1; i++)
    {
        a[i] = a[i+1];
    }

    a[count(a) - 1] = rememberMe;

    return a;
}

/!**
 * Grunt work to assign users
 *
 * It'd be best to run `assignmentRun()` as that method automatically detects errors
 * and fixes them. This is a helper processor.
 *
 * @return void
 *!/

Allocator.prototype.runAssignment = function()
{
    if(count(this.getRoles()) == 0)
        throw new Error("Allocator: Roles are not defined for Allocator ");

    if(count(this.getWorkflowInstances()) == 0)
        throw Error("Allocator: No WorkflowInstances to allocate to");


    //ONLY GOOD FOR USE CASE 1A (is it?)
    var randomizedPool = null;

    var roles = this.getRoles();

    for(var i = 0; i < roles.length; i++)
    {
        var rolePool = this.getPool();

    }

}

Allocator.prototype.count = function(a)
{
    var t = this.getRoles();
    console.log();
}



/!**
 * Add a user role (problem creator, solver, etc)
 *
 * @param string Name of the role
 * @param array
 *!/
Allocator.prototype.createRole = function(name, rules)
{
    var rules = {};
    rules['pool'] = {};
    rules['pool']['test'] = 'Testing';
    rules['pool']['key'] = 'value';
    if(typeof rules === 'undefined')
    {
        rules = [];
        var temp = this.defaultPool();
        rules.push({'pool' : temp})
    }
    else
    {
        var temp = this.defaultPool();
        for (var key in rules['pool']) {
            if (!temp.hasOwnProperty(key)) {
                temp[key] = rules['pool'][key];
            }
        }
        rules['pool'] = temp;

    }

    var roles = {};
    roles['name'] = name;
    roles['rules'] = rules;
    this.appendRoles(roles);

}

/!**
 * Default Pool Settings for a role
 *
 * @return array
 *!/
Allocator.prototype.defaultPool = function()
{
    var defaultpool = {};
    defaultpool['name'] = 'student';
    defaultpool['pull after'] = true;

    return defaultpool;
}

/!**
 * Get the WorkflowInstances
 *
 * @return array
 *!/

Allocator.prototype.getWorkflowInstances = function ()
{
    return this.getWorkflowInstances();
}
*/

module.exports.Allocator = Allocator;
