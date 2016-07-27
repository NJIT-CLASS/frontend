/**
 * Created by cesarsalazar on 4/20/16.
 */

var models = require('../Model');
var User = models.User;
var UserLogin = models.UserLogin;
var UserContact = models.UserContact;
var Course = models.Course;
var Section = models.Section;
var SectionUser = models.SectionUser;

var Semester = models.Semester;
var TaskInstance = models.TaskInstance;
var TaskActivity= models.TaskActivity;
var Assignment= models.Assignment;
var AssignmentInstance= models.AssignmentInstance;

var WorkflowInstance= models.WorkflowInstance;
var WorkflowActivity= models.WorkflowActivity;
var ResetPasswordRequest = models.ResetPasswordRequest;


function TaskFactory(workflow, tasks)
{
    var WorkflowInstance = workflow;
    var TaskInstances = tasks;

    this.getWorkflowInstance = function ()
    {
        return WorkflowInstance;
    }

    this.getTaskInstances = function ()
    {
        return TaskInstances;
    }
}


TaskFactory.prototype.createTasks = function ()
{
    /*if(this.getTasks().length == 0)
        throw Error("No tasks defined for TaskFactory");

    var tasks = this.getTasks();

    /!**
     * Tasks shoud be like
     * [
     *   {
     *       type : 'create a problem',
     *       'content' : {
     *                        duration : 3,
     *                        trigger : [
     *                                      type : 'first task trigger',
     *                                      'task type' : 'create problem',
     *                                      'task types' : 'create problem',
     *                                      'task status' : 'complete'
     *                                  ],
     *                       'user alias' : 'first task trigger',
     *                       'reference task' : 'create problem',
     *                       'instruction' : '...',
     *                       'criteria' : [
     *                                       'Content' : {
     *                                                       'grade' : 0,
     *		                                                'justification' : 0,
	 *		                                                'max' : 30,
	 *		                                                'description' : 'Please grade the content of this solution.',
     *                                                  },
     *                                       'Presentation' : [
     *                                                       'grade' : 0,
     *		                                                'justification' : 0,
     *		                                                'max' : 30,
	 *		                                                'min' : 30,
	 *		                                                'description' : 'Please grade the content of this solution.',
     *                                                  ]
     *                                   ],
     *                      'user alias all types' : true,
     *                      'internal' : true,
     *                      'value' : true,
     *                      'resolve range' : -100,
     *                      expire : [
     *                                  {
     *                                      type' : 'compare value of task',
     *                                      'task type' : 'resolve grades',
     *                                      'compare value' : false,
     *                                  }
     *                              ]
     *
     *                   }
     *   },
     *   {
     *      type : 'edit a problem',
     *      content : {
     *                  ...
     *   },
     *   {
     *      ...
     *   }
     * ]
     *!/
    for(var i = 0; i < tasks.length; i++)
    {
        var count  = 1;
        var task = [i];
        var name = [];
        name['task'] = task.Content ;

        if(typeof task['count'] === 'undefined' || task['count'] == null )
            count = 1;


        for(var c = 0; c < count; c++)
        {

            var t = Task.build( { WorkflowID : this.getWorkflow().workflowID});

            var n = null;

            if(typeof task['behavior'] !== 'undefined')
                n = task['behavior'];
            else
                n = task.type;

            t.type = n;
            t.Status = 'not triggered';
            t.StartDate = null;
            t.Settings = JSON.parse(tasks.Content);
            t.Data = JSON.parse([]);

            if(typeof task.Content['criteria'] !== 'undefined')
                t.setData('grades',task.Content['criteria']);

            t.save().then(function(){
                console.log("Task Saved");
            });
        }

    }*/
}

module.exports.TaskFactory = TaskFactory;
