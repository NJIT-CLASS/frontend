//The main component of the assignment editor. This calls the other components and passes in the methods defined here. The data is all made here and
// will be submitted from this component. This component has no views, it only contains data and components.

import React from 'react';
import request from 'request';
import {cloneDeep, isEmpty} from 'lodash';
var TreeModel = require('tree-model');
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import TaskDetailsComponent from './taskDetails';
import AssignmentDetailsComponent from './assignmentDetails';
import ProblemDetailsComponent from './problemDetails';
import {TASK_TYPES, TASK_TYPE_TEXT} from '../shared/constants';

class AssignmentEditorContainer extends React.Component {

    constructor(props) {
        super(props);

        /*
        Props:
            - UserID
            - CourseID
            - apiUrl
      */

        this.tree = new TreeModel(); //this is the tree making object. It is not a tree structure but has the tree methods
        this.root = this.tree.parse({id: 0}); // this is the root of the tree structure. A copy is made for each workflow
        this.nullNode = this.tree.parse({id: -1}); // this is the null Node template, it has an id of -1

        //need to add TA_name, TA_documentation, TA_trigger_consolidation_threshold
        this.blankTask = {
            TA_type: '',
            TA_name: '',
            SimpleGradePointReduction: 0,
            AllowConsolidations: [
                false, false
            ],
            StartDelay: false,
            TA_file_upload: [
                [
                    0, "mandatory"
                ],
                [0, 'optional']
            ],
            TA_due_type: [
                'duration', 4320
            ],
            TA_start_delay: 0,
            TA_at_duration_end: 'late',
            TA_what_if_late: 'Keep same participant',
            TA_display_name: '',
            TA_one_or_separate: false,
            TA_assignee_constraint: [
                '', '', {}
            ],
            TA_simple_grade: 'none',
            TA_is_final_grade: false,
            TA_overall_instructions: '',
            TA_overall_rubric: '',
            TA_allow_reflection: [
                'none', "don't wait"
            ],
            TA_allow_assessment: 'none',
            TA_allow_revisions: false,
            TA_number_participant: 1,
            TA_function_type: 'max',
            TA_allow_dispute: false,
            TA_leads_to_new_problem: false,
            TA_leads_to_new_solution: false,
            TA_visual_id: '',
            TA_fields: {
                number_of_fields: 1,
                field_titles: [''],
                0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40', //why strings ?
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [
                        null, null
                    ],
                    default_content: ['', '']
                }
            }
        };

        let x = this; //context preserving variable, needed when using inside function

        // this function cusotmizes the generic task tempate above to the type of task it needs;
        var createTaskObject = function(TA_type, TA_name, TA_display_name, TA_at_duration_end, TA_what_if_late, TA_assignee_constraint, TA_is_final_grade) {
            let newTask = cloneDeep(x.blankTask)
            newTask.TA_name = TA_name;
            newTask.TA_type = TA_type;
            newTask.TA_display_name = TA_display_name;
            newTask.TA_at_duration_end = TA_at_duration_end;
            newTask.TA_what_if_late = TA_what_if_late;
            newTask.TA_assignee_constraint = TA_assignee_constraint;
            newTask.TA_is_final_grade = TA_is_final_grade;

            return newTask;
        }

      //////////// Defining all Task Types Here /////////
        this.createProblemTask = createTaskObject(TASK_TYPES.CREATE_PROBLEM, TASK_TYPE_TEXT.create_problem, 'Create Problem', 'late', 'Keep same participant', [
            'student', 'individual', {}
        ], false);

        this.editProblemTask = createTaskObject(TASK_TYPES.EDIT,TASK_TYPE_TEXT.edit, 'Edit Problem', 'late', 'Keep same participant', [
            'instructor', 'group', {}
        ], false);

        this.commmentProblemTask = createTaskObject(TASK_TYPES.COMMENT,TASK_TYPE_TEXT.comment, 'Comment on Problem', 'late', 'Keep same participant', [
            'instructor', 'group', {}
        ], false);

        this.solveProblemTask = createTaskObject(TASK_TYPES.SOLVE_PROBLEM,TASK_TYPE_TEXT.solve_problem, 'Solve the Problem', 'late', 'Keep same participant', [
            'student', 'individual', {}
        ], false);

        this.gradeSolutionTask = createTaskObject(TASK_TYPES.GRADE_PROBLEM,TASK_TYPE_TEXT.grade_problem, 'Grade the Solution', 'late', 'Keep same participant', [
            'student', 'individual', {}
        ], true);

        this.critiqueSolutionTask = createTaskObject(TASK_TYPES.CRITIQUE,TASK_TYPE_TEXT.critique, 'Critique the Solution', 'late', 'Keep same participant', [
            'student', 'individual', {}
        ], true);

        this.needsConsolidationTask = createTaskObject(TASK_TYPES.NEEDS_CONSOLIDATION,TASK_TYPE_TEXT.needs_consolidation, 'Needs Consolidation', null, null, [
            'student', 'individual', {}
        ], true);

        this.consolidationTask = createTaskObject(TASK_TYPES.CONSOLIDATION,TASK_TYPE_TEXT.consolidation, 'Consolidate', 'late', 'Keep same participant', [
            'student', 'individual', {}
        ], true);

        this.disputeTask = createTaskObject(TASK_TYPES.DISPUTE,TASK_TYPE_TEXT.dispute, 'Dispute the Grades', 'resolved', 'Consider Resolved', [
            'student', 'individual', {}
        ], false);

        this.resolveDisputeTask = createTaskObject(TASK_TYPES.RESOLVE_DISPUTE, TASK_TYPE_TEXT.resolve_dispute, 'Resolve the Dispute', 'late', 'Keep same participant', [
            'student', 'individual', {}
        ], true);

        this.completeTask = createTaskObject(TASK_TYPES.COMPLETED, TASK_TYPE_TEXT.completed, 'Complete', null, null, [
            'student', 'individual', {}
        ], false);

       ///----------------------

        let standardWorkflow = [cloneDeep(this.createProblemTask)];
        // let standardWorkflow = [this.createProblemTask, this.editProblemTask, this.solveProblemTask, this.gradeSolutionTask,
        //   this.needsConsolidationTask, this.consolidationTask, this.disputeTask, this.resolveDisputeTask, this.completeTask];


        //template for the standard workflow
        this.blankWorkflow = {
            WA_name: 'Problem',
            WA_type: '',
            WA_number_of_sets: 1,
            WA_documentation: '',
            WA_default_group_size: 1,
            WA_grade_distribution: {},
            Workflow: standardWorkflow,
            WorkflowStructure: cloneDeep(this.root) //this is the tree structure for that particular workflow
        };

        this.state = {
            CurrentWorkflowIndex: 0,
            SubmitSuccess: false,
            SubmitButtonShow: true,
            SaveSuccess: false,
            SubmitError: false,
            Loaded: false,
            Courses: null,
            Semesters:null,
            AssignmentActivityData: {
                AA_userID: parseInt(this.props.UserID),
                AA_name: 'Assignment',
                AA_course: parseInt(this.props.CourseID),
                AA_instructions: '',
                AA_type: '',
                AA_display_name: '',
                AA_section: null,
                AA_semester: null,
                AA_grade_distribution: null,
                AA_documentation: '',
                NumberofWorkflows: 1
            },
            WorkflowDetails: [cloneDeep(this.blankWorkflow)]
        };
    }

    componentWillMount(){
      //get components and semesters
      //get call to get semesters
      let coursesArray = null;
      let semestersArray = null;
      const options = {
          method: 'GET',
          uri: this.props.apiUrl + '/api/semester',
          json: true
      };

      request(options, (err, res, body) => {
        semestersArray = body.Semesters.map(function(sem){
          return ( {value: sem.SemesterID, label: sem.Name} );
        });

        if(this.props.CourseID === '*' || this.props.CourseID === ''){
          const options2 = {
              method: 'GET',
              uri: this.props.apiUrl + '/api/getCourseCreated/'+ this.props.UserID,
              json: true
          };
          request(options2, (err, res, bod) => {
            coursesArray = bod.Courses.map(function(course){
              return ({value: course.CourseID, label: course.Name});
            });

            this.setState({
              Semesters:semestersArray,
              Courses: coursesArray,
              Loaded: true
            });
          });
        }

        this.setState({
          Semesters:semestersArray,
          Courses: null,
          Loaded: true
        });
      });
    }

    componentDidMount(){
      //this sets the default problem structure
      this.changeDataCheck("TA_allow_reflection", 0, 0);
      this.changeDataCheck('TA_leads_to_new_solution', 0,0);
      this.changeDataCheck("TA_allow_assessment", 2, 0);
      this.changeDataCheck("Assess_Consolidate", 2, 0);
      this.changeDataCheck("Assess_Dispute", 2, 0);

    }

    onSubmit() {


      //Place Workflows in AssignmentActivityData object for compatability with backend call
        let sendData = cloneDeep(this.state.AssignmentActivityData);
        sendData.WorkflowActivity = cloneDeep(this.state.WorkflowDetails);

        ///////// Reduce array and tree into usable parts
        sendData.WorkflowActivity.forEach((workflow, index) => {
          let counter = 0;
          let mapping = {};
          let newWorkflow = new Array();
          workflow.WorkflowStructure.walk(function(task){
            if(task.model.id != -1){
              mapping[task.model.id] = counter;
              newWorkflow.push(workflow.Workflow[task.model.id]);
              task.model.id = counter++;
            }
          }, this);

          //Clean AssigneeConstraints and Grade Dist on frontend secondIndex


          workflow.Workflow.forEach(function(task){
              Object.keys(task.TA_assignee_constraint[2]).forEach(function(constr){
                task.TA_assignee_constraint[2][constr] = task.TA_assignee_constraint[2][constr].map(function(id){
                  return (mapping[id]);
                });
              });

          });

          let newGradeDist = new Object();
          Object.keys(workflow.WA_grade_distribution).forEach(function(taskKey){
            newGradeDist[mapping[taskKey]] = workflow.WA_grade_distribution[taskKey];
          })

          workflow.WA_grade_distribution = newGradeDist;
          workflow.Workflow = newWorkflow;

        });





        //need to add Completed task to each workflow
        sendData.WorkflowActivity.forEach((workflow, idx) => {
          workflow.Workflow.push(this.createNewCompleteTask(idx));

        });

        console.log(sendData);
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/assignment/create',
            body: {
                assignment: sendData
            },
            json: true
        };

        request(options, (err, res, body) => {
            if (err == null && res.statusCode == 200) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                this.setState({
                  SubmitSuccess: true,
                  SubmitButtonShow: false
                        });
            } else {
                console.log('Submit failed');
                this.setState({SubmitError: true});
            }
        });
    }

    ////////////// Tree Methods //////////////////////////////////////////////
    addAssessment(index, workflowIndex) {
        //add a critique task to the tree-array; possibly consolidate and needs consol.
        let newData = this.state.WorkflowDetails;
        let newTask = this.createNewTask(this.gradeSolutionTask,index, workflowIndex, 'Grade');
        newData[workflowIndex].Workflow.push(newTask);

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == index;
        });

        if (selectedNode.children[0] === undefined) {
            selectedNode.children[0] = this.nullNode;
        }

        if (selectedNode.children[1] !== undefined && selectedNode.children[1] !== this.nullNode) {
            selectedNode.children[1].children[1] = this.tree.parse({
                id: newData[workflowIndex].Workflow.length - 1
            });
        } else {
            selectedNode.children[1] = this.tree.parse({
                id: newData[workflowIndex].Workflow.length - 1
            });
        }

        this.setState({WorkflowDetails: newData});
    }

    addConsolidation(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow.push(this.createNewTask(this.needsConsolidationTask, parentIndex, workflowIndex, 'Needs Consolidation of'));
        newData[workflowIndex].Workflow.push(this.createNewTask(this.consolidationTask, parentIndex, workflowIndex, 'Consolidate'));

        let consolidateNode = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 2,
            children: [
                {
                    id: newData[workflowIndex].Workflow.length - 1
                }
            ]
        });

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (selectedNode.children[0] === undefined || selectedNode.children[0].model.id == -1) { //special case of adding consol after instructor has already added a reflect to reflection task
            selectedNode.children[0] = consolidateNode;
        } else if (newData[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE) {
            if (selectedNode.children[0].children[1] === undefined || selectedNode.children[0].children[1].model.id == -1) {
                let temp = selectedNode.children[0];
                selectedNode.children[0] = consolidateNode;
                selectedNode.children[0].children[0].children[0] = temp;
            } else {
                let temp = selectedNode.children[0];
                let temp2 = selectedNode.children[0].children[1];

                selectedNode.children[0] = consolidateNode;
                selectedNode.children[0].children[0].children[0] = temp;
                selectedNode.children[0].children[1] = temp2;
            }
        } else {
            let temp = selectedNode.children[0];
            selectedNode.children[0] = consolidateNode;
            selectedNode.children[0].children[1] = temp;
        }

        this.setState({WorkflowDetails: newData});
    }

    addCreate(index, workflowIndex) {
        let newData = this.state.WorkflowDetails;

        newData[workflowIndex].Workflow.push(cloneDeep(this.createProblemTask));

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == index;
        });

        if (selectedNode.children[0] === undefined) {
            selectedNode.addChild(this.nullNode);
        }

        if (selectedNode.children[1] === undefined) {
            selectedNode.addChild(this.nullNode);
        }

        selectedNode.children[2] = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 1
        });

        this.setState({WorkflowDetails: newData});
    }

    addDispute(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;

        newData[workflowIndex].Workflow.push(this.createNewTask(this.disputeTask, parentIndex, workflowIndex, 'Dispute of '));
        newData[workflowIndex].Workflow.push(this.createNewTask(this.resolveDisputeTask,parentIndex, workflowIndex, 'Resolve Dispute of'));

        let disputeNode = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 2,
            children: [
                {
                    id: newData[workflowIndex].Workflow.length - 1
                }
            ]
        });

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (selectedNode.children[0] === undefined || selectedNode.children[0] === this.nullNode) { //special case of adding consol after instructor has already added a reflect to reflection task
            selectedNode.children[0] = disputeNode;

        } else if (newData[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION) {
            selectedNode.children[0].children[0].children[0] = disputeNode;
        } else {
            let temp = selectedNode.children[0];
            selectedNode.children[0] = disputeNode;
            selectedNode.children[0].children[1] = temp;
        }

    }

    addReflection(index, workflowIndex) { // add edit to slot 1 of 4 for nodes
        let newData = this.state.WorkflowDetails;
        let newTask = this.createNewTask(this.editProblemTask,index, workflowIndex, 'Edit')
        newData[workflowIndex].Workflow.push(newTask);

        let selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == index;
        });

        if (selectedNode.children[0] !== undefined && selectedNode.children[0] !== this.nullNode) { // special case of reflecting  a reflect
            selectedNode.children[0].children[1] = this.tree.parse({
                id: (newData[workflowIndex].Workflow.length - 1)
            });
        } else {
            selectedNode.children[0] = this.tree.parse({
                id: (newData[workflowIndex].Workflow.length - 1)
            }); //general case
        }
        this.setState({WorkflowDetails: newData});
    }

    addSolve(index, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let newSolve = cloneDeep(this.solveProblemTask);
        newData[workflowIndex].Workflow.push(newSolve);

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == index;
        });

        if (selectedNode.children[0] === undefined) {
            selectedNode.addChild(this.nullNode);
        }

        if (selectedNode.children[1] === undefined) {
            selectedNode.addChild(this.nullNode);
        }

        if (selectedNode.children[2] === undefined) {
            selectedNode.addChild(this.nullNode);
        }

        selectedNode.children[3] = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 1
        });

        this.setState({WorkflowDetails: newData});
    }

    changeAssessment(parentIndex, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;

        let changeIndex = this.getAssessIndex(parentIndex, workflowIndex)
        let newTask = {};

        if (value == 'grade') {
            newTask = this.createNewTask(this.gradeSolutionTask,parentIndex, workflowIndex, 'Grade');
        } else if (value == 'critique') {
            newTask = this.createNewTask(this.critiqueSolutionTask,parentIndex, workflowIndex, 'Critique');
        } else {
            return;
        }
        newData[workflowIndex].Workflow[changeIndex] = newTask;

        this.setState({WorkflowDetails: newData});
    }

    changeReflection(parentIndex, workflowIndex, value) {

        let newData = this.state.WorkflowDetails;
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        let changeIndex = selectedNode.children[0].model.id;
        let newTask = {};

        if (value == 'comment') {
            newTask = this.createNewTask(this.commmentProblemTask,parentIndex, workflowIndex, 'Comment on');
        } else if (value == 'edit') {
          newTask = this.createNewTask(this.editProblemTask, parentIndex, workflowIndex, 'Edit');
        }

        newData[workflowIndex].Workflow[changeIndex] = newTask;

        this.setState({WorkflowDetails: newData});
    }

    createNewTask(taskType, index, workflowIndex, string){
      let prevTaskName = this.state.WorkflowDetails[workflowIndex].Workflow[index].TA_name;
      let newTask = cloneDeep(taskType);
      let newText = string+" "+ prevTaskName;
      if(newText.length > 25){ //need to do this because of database limit
        switch(taskType.TA_type){
          case TASK_TYPES.EDIT:
            newText = string + ' Problem';
            break;
          case TASK_TYPES.COMMENT:
            newText = string + ' Problem';
            break;
          case TASK_TYPES.GRADE_PROBLEM:
            newText = string + ' Problem';
            break;
          case TASK_TYPES.CRITIQUE:
            newText = string + ' Problem';
            break;
          case TASK_TYPES.NEEDS_CONSOLIDATION:
            newText = 'Needs Consolidation';
            break;
          case TASK_TYPES.CONSOLIDATION:
            newText = string + ' Grades';
            break;
          case TASK_TYPES.DISPUTE:
            newText = string + ' Grades';
            break;
          case TASK_TYPES.RESOLVE_DISPUTE:
            newText = string + ' Grades';
            break;
          default:
            newText = string;
            break;
        }

      }
      newTask.TA_name = string+" "+ prevTaskName;
      newTask.TA_display_name = newText;
      return newTask;
    }

    createNewCompleteTask(workflowIndex){
      let newTask = cloneDeep(this.completeTask);
      newTask.TA_name = "Workflow " + (workflowIndex + 1) + " Complete"
      newTask.TA_display_name = "Workflow " + (workflowIndex + 1) + " Complete"
      return newTask;
    }

    getAssessIndex(parentIndex, workflowIndex) {
        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.GRADE_PROBLEM || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.CRITIQUE) {
            return selectedNode.children[1].model.id;
        } else if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.DISPUTE) {
            return selectedNode.children[1].children[1].model.id;
        }
    }

    getAssessNumberofParticipants(index, workflowIndex) {
        let x = this;

        //root.first changes this context, so need to save it here
        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === x.getAssessIndex(index, workflowIndex);
        });
        return this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant;
    }

    getReflectIndex(parentIndex, workflowIndex) {
        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.EDIT || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.COMMENT) {
            return selectedNode.children[0].model.id;
        } else if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE) {
            return selectedNode.children[0].children[1].model.id;
        }
    }

    getReflectNumberofParticipants(index, workflowIndex) {
        let x = this; //root.first chnages this context, so need to save it here

        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === x.getReflectIndex(index, workflowIndex);
        });

        return this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant;
    }

    hasDispute(consoleNode, workflowIndex) {
        if (consoleNode.children[0].children[0] !== undefined && this.state.WorkflowDetails[workflowIndex].Workflow[consoleNode.children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE) {

            return true;
        } else {

            return false;
        }
    }

    removeAssess(parentIndex, workflowIndex) {
        let x = this;
        let newData = this.state.WorkflowDetails;
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        let assessIndex = selectedNode.children[1].model.id;

        selectedNode.children[1].walk(function(node) {
            x.cleanAssigneeConstraints(node.model.id, workflowIndex);
            newData[workflowIndex].Workflow[node.model.id] = {};
        });

        selectedNode.children[1] = this.nullNode;

        this.setState({WorkflowDetails: newData});

    }

    removeConsolidation(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (selectedNode.children.length == 0) {
            return;
        }
        let x = this; //context variable
        let needsConsoleIndex = selectedNode.children[0].model.id;
        let consoleIndex = selectedNode.children[0].children[0].model.id;

        if (this.hasDispute(selectedNode.children[0], workflowIndex)) {
            let temp = selectedNode.children[0].children[0].children[0];
            if (selectedNode.children[0].children[1] == undefined) {

                selectedNode.children[0].walk(function(node) {
                    if (node.model.id == selectedNode.children[0].children[0].children[0].model.id) {
                        return false;
                    }
                    if (node != x.nullNode) {
                        newData[workflowIndex].Workflow[node.model.id] = {};
                    }
                })

                selectedNode.children[0] = temp;
            } else {
                selectedNode.children[0].walk(function(node) {
                    if (node.model.id == selectedNode.children[0].children[0].children[0].model.id) {
                        return false;
                    }
                    if (node != x.nullNode) {
                        newData[workflowIndex].Workflow[node.model.id] = {};
                    }
                })

                let temp2 = selectedNode.children[0].children[1];
                selectedNode.children[0] = temp;
                selectedNode.children[0].children[1] = temp2;
            }
        } else {
            if (selectedNode.children[0].children[1] != undefined) {
                let temp = selectedNode.children[0].children[1];
                selectedNode.children[0].walk(function(node) {
                    if (node != x.nullNode) {
                        newData[workflowIndex].Workflow[node.model.id] = {};
                    }
                });
                selectedNode.children[0] = temp;
            } else {
                selectedNode.children[0].walk(function(node) {
                    if (node != x.nullNode) {
                        newData[workflowIndex].Workflow[node.model.id] = {};
                    }
                });
                selectedNode.children[0] = this.nullNode;
            }
        }

        this.setState({WorkflowDetails: newData});
    }

    removeCreate(parentIndex, workflowIndex) {
        let x = this;
        let newData = this.state.WorkflowDetails;

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        let createIndex = selectedNode.children[2].model.id;

        selectedNode.children[2].walk(function(node) {
            x.cleanAssigneeConstraints(node.model.id, workflowIndex);
            newData[workflowIndex].Workflow[node.model.id] = {};
        });
        selectedNode.children[2].drop();

        this.setState({WorkflowDetails: newData});
    }

    removeDispute(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let x = this; //context preserving variable
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE) {
            if (selectedNode.children[0].children[1] !== undefined && (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].children[1].model.id].TA_type === TASK_TYPES.EDIT || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].children[1].model.id].TA_type === TASK_TYPES.COMMENT)) {
                let temp = selectedNode.children[0].children[1];
                selectedNode.children[0].walk(function(node) {
                    if (node != x.nullNode) {
                        newData[workflowIndex].Workflow[node.model.id] = {};
                    }
                });
                selectedNode.children[0] = temp;
            } else {
                selectedNode.children[0].walk(function(node) {
                    if (node != x.nullNode) {
                        newData[workflowIndex].Workflow[node.model.id] = {};
                    }
                });
            }
        } else {
            if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE) {
                selectedNode.children[0].children[0].children[0].walk(function(node) {
                    if (node != x.nullNode) {
                        newData[workflowIndex].Workflow[node.model.id] = {};
                    }
                });
            } else {}
        }

        this.setState({WorkflowDetails: newData});
    }

    removeReflect(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let x = this;
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        let reflectIndex = selectedNode.children[0].model.id;

        selectedNode.children[0].walk(function(node) {
            x.cleanAssigneeConstraints(node.model.id, workflowIndex);
            newData[workflowIndex].Workflow[node.model.id] = {};
        })

        selectedNode.children[0] = this.nullNode;

        this.setState({WorkflowDetails: newData});
    }

    removeSolve(parentIndex, workflowIndex) {
        let x = this;
        let newData = this.state.WorkflowDetails;
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        let createIndex = selectedNode.children[3].model.id;

        selectedNode.children[3].walk(function(node) {
            x.cleanAssigneeConstraints(node.model.id, workflowIndex);
            newData[workflowIndex].Workflow[node.model.id] = {};
        });
        selectedNode.children[3].drop();

        this.setState({WorkflowDetails: newData});
    }

    setAssessNumberofParticipants(index, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        let x = this; //root.first chnages this context, so need to save it here

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === x.getAssessIndex(index, workflowIndex);
        });

        newData[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant = value;

        if (value <= 1 && newData[workflowIndex].Workflow[index].AllowConsolidations[1] == true) {
            newData[workflowIndex].Workflow[index].AllowConsolidations[1] = false;
            this.removeConsolidationfromAssess(this.getAssessIndex(index, workflowIndex), workflowIndex);
        }
        this.setState({WorkflowDetails: newData});
    }

    setReflectNumberofParticipants(index, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        let x = this; //root.first chnages this context, so need to save it here
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === x.getReflectIndex(index, workflowIndex);
        });

        newData[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant = value;

        if (value <= 1 && newData[workflowIndex].Workflow[index].AllowConsolidations[0] == true) {
            newData[workflowIndex].Workflow[index].AllowConsolidations[0] = false;
            this.removeConsolidation(this.getReflectIndex(index, workflowIndex));
        }

        this.setState({WorkflowDetails: newData});
    }
    //------------------------------------------------------------------------


    ////////////// Task Activity change methods //////////////////////////////

    addFieldButton(index, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[index].TA_fields[newData[workflowIndex].Workflow[index].TA_fields.number_of_fields] = {
            title: '',
            show_title: false,
            assessment_type: null,
            numeric_min: 0,
            numeric_max: 0,
            rating_max: 5,
            list_of_labels: 'Easy, Medium, Difficult',
            field_type: "text",
            requires_justification: false,
            instructions: '',
            rubric: '',
            justification_instructions: '',
            default_refers_to: [
                null, null
            ],
            default_content: ['', '']
        };
        newData[workflowIndex].Workflow[index].TA_fields.number_of_fields += 1;
        newData[workflowIndex].Workflow[index].TA_fields.field_titles.push('');

        this.setState({WorkflowDetails: newData})
    }

    changeDataCheck(stateField, index, workflowIndex, firstIndex) {
        let newData = this.state.WorkflowDetails;

        switch (stateField) {
            case "TA_allow_reflection":
                {
                    if (newData[workflowIndex].Workflow[index][stateField][0] != 'none') {
                        this.removeReflect(index, workflowIndex);
                        newData[workflowIndex].Workflow[index][stateField][0] = 'none';
                        newData[workflowIndex].Workflow[index].AllowConsolidations[0] = false;

                    } else {
                        newData[workflowIndex].Workflow[index][stateField][0] = 'edit';
                        this.addReflection(index, workflowIndex);
                    }
                }
                break;

            case "TA_allow_assessment":
                {
                    if (newData[workflowIndex].Workflow[index][stateField] != 'none') {
                        this.removeAssess(index, workflowIndex);
                        newData[workflowIndex].Workflow[index][stateField] = 'none';
                        newData[workflowIndex].Workflow[index].AllowConsolidations[1] = false;

                    } else {
                        this.addAssessment(index, workflowIndex);
                        newData[workflowIndex].Workflow[index][stateField] = 'grade';
                    }
                }
                break;
            case "TA_leads_to_new_problem":
                {
                    if (newData[workflowIndex].Workflow[index][stateField]) {
                        this.removeCreate(index, workflowIndex);
                        newData[workflowIndex].Workflow[index][stateField] = false;
                    } else {
                        this.addCreate(index, workflowIndex);
                        newData[workflowIndex].Workflow[index][stateField] = true;
                    }
                }
                break;
            case "TA_leads_to_new_solution":
                {
                    if (newData[workflowIndex].Workflow[index][stateField]) {
                        this.removeSolve(index, workflowIndex);
                        newData[workflowIndex].Workflow[index][stateField] = false;
                    } else {
                        this.addSolve(index, workflowIndex);
                        newData[workflowIndex].Workflow[index][stateField] = true;
                    }
                }
                break;

            case "Reflect_Consolidate":
                {
                    if (newData[workflowIndex].Workflow[index].AllowConsolidations[0]) {
                        this.removeConsolidation(this.getReflectIndex(index, workflowIndex), workflowIndex);
                        newData[workflowIndex].Workflow[index].AllowConsolidations[0] = false;
                    } else {
                        this.addConsolidation(this.getReflectIndex(index, workflowIndex), workflowIndex);
                        newData[workflowIndex].Workflow[index].AllowConsolidations[0] = true;
                    }
                }
                break;

            case "Reflect_Dispute":
                {
                    let reflectIndex = this.getReflectIndex(index, workflowIndex);
                    if (newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute) {
                        newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = false;
                        this.removeDispute(reflectIndex, workflowIndex);
                    } else {
                        newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = true;
                        this.addDispute(reflectIndex, workflowIndex);
                    }

                }
                break;

            case "Assess_Consolidate":
                {
                    if (newData[workflowIndex].Workflow[index].AllowConsolidations[1]) {
                        this.removeConsolidation(this.getAssessIndex(index, workflowIndex), workflowIndex);
                        newData[workflowIndex].Workflow[index].AllowConsolidations[1] = false;
                    } else {
                        this.addConsolidation(this.getAssessIndex(index, workflowIndex), workflowIndex);
                        newData[workflowIndex].Workflow[index].AllowConsolidations[1] = true;
                    }
                }
                break;

            case 'Assess_Dispute':
                {
                    let assessIndex = this.getAssessIndex(index, workflowIndex);
                    if (newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute) {
                        newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = false;
                        this.removeDispute(assessIndex, workflowIndex);
                    } else {
                        newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = true;
                        this.addDispute(assessIndex, workflowIndex);
                    }
                }
                break;

            case "TA_assignee_constraint":
                {
                    if (newData[workflowIndex].Workflow[index][stateField][1] != 'group') {
                        newData[workflowIndex].Workflow[index][stateField][1] = 'group';
                    } else {
                        newData[workflowIndex].Workflow[index][stateField][1] = 'individual';
                    }
                }
                break;

            default:
                newData[workflowIndex].Workflow[index][stateField] = this.state.WorkflowDetails[workflowIndex].Workflow[index][stateField]
                    ? false
                    : true;
                break;
        }

        this.setState({WorkflowDetails: newData});
    }

    changeDropdownData(stateField, index, workflowIndex, e) {
        let newData = this.state.WorkflowDetails;
        if (stateField == 'TA_allow_reflection') {
            newData[workflowIndex].Workflow[index][stateField][0] = e.value;
            this.changeReflection(index, workflowIndex, e.value);
        } else if (stateField == 'TA_allow_assessment') {
            newData[workflowIndex].Workflow[index][stateField] = e.value;
            this.changeAssessment(index, workflowIndex, e.value);
        } else if (stateField == 'TA_assignee_constraint') {
            newData[workflowIndex].Workflow[index][stateField][0] = e.value;
        } else {
            newData[workflowIndex].Workflow[index][stateField] = e.value;
        }
        this.setState({WorkflowDetails: newData});
    }

    changeAssigneeInChild(reflect, index, workflowIndex, e){ //special setter function that changes the assignee constraints of the child Reflect/Assess node
      //if called by a Reflection node, reflect will be true, if Assessment node, reflect is false
      let newData = this.state.WorkflowDetails;
      //need to go into tree here and get index
      let target = reflect ? this.getReflectIndex(index, workflowIndex) : this.getAssessIndex(index, workflowIndex); // index of child (reflect/assess) node
      newData[workflowIndex].Workflow[target]['TA_assignee_constraint'][0] = e.value;
      this.setState({WorkflowDetails: newData});
    }

    getAssigneeInChild(reflect, index, workflowIndex){
      return (reflect ? this.getReflectIndex(index, workflowIndex) : this.getAssessIndex(index, workflowIndex));
    }

    cleanAssigneeConstraints(deleteTaskIndex, workflowIndex) {
        //will need to go through list of workflows, go to TA_assignee_constraint[2], go through ALL constraints keys, check if index is in the array, if it is, pop it
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow.forEach(function(task) {
            if (Object.keys(task).length > 0) {
                Object.keys(task.TA_assignee_constraint[2]).forEach(function(key) {
                    let inArray = task.TA_assignee_constraint[2][key].indexOf(deleteTaskIndex);
                    if (inArray > -1) {
                        task.TA_assignee_constraint[2][key].splice(inArray, 1);
                    }
                });
            }
        });

        this.setState({WorkflowDetails: newData});

    }

    checkAssigneeConstraints(index, constraint, workflowIndex) {
        let newData = this.state.WorkflowDetails;

        if (constraint === 'none') {
            newData[workflowIndex].Workflow[index].TA_assignee_constraint[2] = {};
            this.setState({WorkflowDetails: newData});
            return;

        }

        if (newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint] === undefined) {
            newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint] = [];
        } else {
            delete newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint];
        }

        this.setState({WorkflowDetails: newData})
    }

    checkAssigneeConstraintTasks(index, constraint, referId, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let indexInArray = newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint].indexOf(referId);

        if (indexInArray > -1) {
            newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint].splice(indexInArray, 1);
        } else {
            newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint].push(referId);
        }
        this.setState({WorkflowDetails: newData});
    }

    changeDropdownFieldData(stateField, index, field, workflowIndex, e) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = e.value;

        this.setState({WorkflowDetails: newData});
    }

    changeFieldName(index, field, workflowIndex, e) {
        if (e.target.value > 1000) {
            return;
        }
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[index].TA_fields[field].title = e.target.value;
        newData[workflowIndex].Workflow[index].TA_fields.field_titles[field] = e.target.value;
        this.setState({WorkflowDetails: newData});
    }

    changeFieldCheck(stateField, index, field, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = this.state.WorkflowDetails[workflowIndex].Workflow[index].TA_fields[field][stateField]
            ? false
            : true;
        this.setState({WorkflowDetails: newData});
    }

    changeFileUpload(taskIndex, firstIndex, secondIndex, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex].TA_file_upload[firstIndex][secondIndex] = val;
        this.setState({WorkflowDetails: newData});
    }

    changeInputData(stateField, index, workflowIndex, e) {
        if (e.target.value.length > 45000) {
            return;
        }
        if (stateField == 'TA_display_name') {
            if (e.target.value.length > 25) {
                return;
            }
        }
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[index][stateField] = e.target.value;
        this.setState({WorkflowDetails: newData});
    }

    changeInputFieldData(stateField, index, field, workflowIndex, e) {
        if (e.target.value.length > 45000) {
            return;
        }
        let newData = this.state.WorkflowDetails;
        if (stateField == 'default_content') {
            newData[workflowIndex].Workflow[index].TA_fields[field][stateField][0] = e.target.value;
        } else {
            newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = e.target.value;
        }
        this.setState({WorkflowDetails: newData});
    }

    changeNumericData(stateField, index, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        if (stateField == 'TA_due_type') {
            newData[workflowIndex].Workflow[index][stateField][1] = value * 1440;
        } else {
            newData[workflowIndex].Workflow[index][stateField] = value;
        }
        this.setState({WorkflowDetails: newData});
    }

    changeNumericFieldData(stateField, index, field, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = value;
        this.setState({WorkflowDetails: newData});
    }

    changeRadioData(stateField, index, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        switch(stateField){
          case 'TA_due_type':
            newData[workflowIndex].Workflow[index][stateField][0] = val;
            break;
          case 'StartDelay':
              {
                newData[workflowIndex].Workflow[index][stateField] = val;
                newData[workflowIndex].Workflow[index]['TA_start_delay'] = (val ? 1 : 0);
              }
          default:
            newData[workflowIndex].Workflow[index][stateField] = val;
            break;


        }
        this.setState({WorkflowDetails: newData});
    }

    changeSimpleGradeCheck(index, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let temp = null;
        if (this.state.WorkflowDetails[workflowIndex].Workflow[index].TA_simple_grade == 'none') {
            temp = "exists";
        } else {
            temp = 'none';
        }

        newData[workflowIndex].Workflow[index].TA_simple_grade = temp;
        newData[workflowIndex].Workflow[index].SimpleGradePointReduction = 0;
        this.setState({WorkflowDetails: newData});
    }

    changeTASimpleGradeCheck(index, workflowIndex) {

        let newData = this.state.WorkflowDetails;
        if (newData[workflowIndex].Workflow[index].TA_simple_grade != 'off_per_day(100)') {
            newData[workflowIndex].Workflow[index].TA_simple_grade = 'off_per_day(100)';
            newData[workflowIndex].Workflow[index].SimpleGradePointReduction = 100;
        } else {
            newData[workflowIndex].Workflow[index].TA_simple_grade = 'off_per_day(5)';
            newData[workflowIndex].Workflow[index].SimpleGradePointReduction = 5;
        }

        this.setState({WorkflowDetails: newData})
    }

    changeTASimpleGradePoints(index, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        if (val == 0) {
            newData[workflowIndex].Workflow[index].TA_simple_grade = 'exists';

        } else {
            newData[workflowIndex].Workflow[index].TA_simple_grade = 'off_per_day(' + val + ')';

        }

        newData[workflowIndex].Workflow[index].SimpleGradePointReduction = val;

        this.setState({WorkflowDetails: newData});

    }

    getAlreadyCreatedTasks(currTaskIndex, workflowIndex) {
        let tasksList = [];

        for(let q = 0; q < currTaskIndex; q++){
          if (q == currTaskIndex) {
            break;
          }

          if (this.state.WorkflowDetails[workflowIndex].Workflow[q] != {}) {
              if (this.state.WorkflowDetails[workflowIndex].Workflow[q].TA_display_name !== undefined) {
                tasksList.push({value: q, label: this.state.WorkflowDetails[workflowIndex].Workflow[q].TA_display_name});
              }
            }
        }


        return tasksList;
    }



  //-----------------------------------------------------------------------------

//////////////////   Assignment Details Functions  //////////////////////////////////

    changeAssignmentInput(fieldName, event) {
        if (event.target.value.length > 45000) {
            return;
        }
        if (fieldName == 'AA_name') {
            if (event.target.value.length > 255) {
                return;
            }
        }
        let newData = this.state.AssignmentActivityData;
        newData[fieldName] = event.target.value;
        this.setState({AssignmentActivityData: newData});
    }

    changeAssignmentDropdown(fieldName, event) {
        let newData = this.state.AssignmentActivityData;
        newData[fieldName] = event.value;
        this.setState({AssignmentActivityData: newData});
    }

    changeAssignmentNumeric(fieldName, value) {
        let newData = this.state.AssignmentActivityData;
        let newWorkflowData = this.state.WorkflowDetails;

        if (isNaN(parseFloat(value))) {
            return;
        }
        // uncomment this only when multiple workflows are properly handled !
        if (fieldName == 'NumberofWorkflows') {
            if (value > 100) {
                return;
            }
            let difference = this.state.AssignmentActivityData.NumberofWorkflows - value;
            if (difference > 0) {
                while (difference > 0) {
                    newWorkflowData.pop();
                    difference -= 1;
                }
            } else if (difference < 0) {
                while (difference < 0) {
                    newWorkflowData.push(cloneDeep(this.blankWorkflow));
                    difference += 1;
                }
            }
        }

        newData[fieldName] = value;
        this.setState({AssignmentActivityData: newData});
    }

    ////////////////    Workflow (Problem) Details functions    ////////////////////

    handleSelect(value) { //need this for the tabs that appear on multiple workflows
        this.setState({CurrentWorkflowIndex: value});
    }

    changeWorkflowData(stateField, workflowIndex, value) {
        let newWorkflowDetails = this.state.WorkflowDetails;
        newWorkflowDetails[workflowIndex][stateField] = value;
        this.setState({WorkflowDetails: newWorkflowDetails});
    } //this handles changing any NumberField data values

    changeWorkflowGradeDist(workflowIndex, taskIndex,value){
      let newWorkflowDetails = this.state.WorkflowDetails;
      newWorkflowDetails[workflowIndex].WA_grade_distribution[taskIndex] = value;
      this.setState({WorkflowDetails: newWorkflowDetails});
    } // this is special for the grade distribution object

    changeWorkflowInputData(stateField, workflowIndex, e) {
        if (e.target.value.length > 45000) {
            return;
        }
        if (stateField == 'WA_name') {
            if (e.target.value.length > 30) {
                return;
            }
        }
        let newWorkflowDetails = this.state.WorkflowDetails;
        newWorkflowDetails[workflowIndex][stateField] = e.target.value;
        this.setState({WorkflowDetails: newWorkflowDetails});
    } //handles changes of text input fields

    changeWorkflowDropdownData(stateField, workflowIndex, e) { // handles chages for Dropdown fields
        let newWorkflowDetails = this.state.WorkflowDetails;
        newWorkflowDetails[workflowIndex][stateField] = e.value;
        this.setState({WorkflowDetails: newWorkflowDetails});
    }

    getFinalGradeTasks(workflowIndex){ //gets a list of all the tasks that will be accounted for in grading distribution
                                      //and returns an array of task objects with an id, name and weight
      let newArray = new Array();

      this.state.WorkflowDetails[workflowIndex].Workflow.forEach(function(task, index){
          if(task.TA_is_final_grade){
            newArray.push({id: index, name: task.TA_display_name, weight: 0.0});
          }
      });

      for(let i = 0; i<newArray.length; i++){
        newArray[i].weight = 1.0/newArray.length;
      }

      return newArray;
    }

    ///---------------------------------------------------------------------------

  render(){
    let infoMessage = null;
    let submitButtonView = (<button type="button" action="#" className="outside-button" onClick={this.onSubmit.bind(this)}><i className="fa fa-check">Submit</i></button>
            );

    if(this.state.SubmitSuccess){
      infoMessage = (<span onClick={() => {this.setState({SubmitSuccess: false})}} style={{backgroundColor: '#00AB8D', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px rgb(0, 171, 141)'}}> Successfully created assignment! </span>);

    }
    if(this.state.SubmitError){
      infoMessage = (<span onClick={() => {this.setState({SubmitError: false})}} style={{backgroundColor: '#ed5565', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px #ed5565'}}>Submit Error! Please check your work and try again </span>);
    }

    if(!this.state.Loaded){
      return(
        <div>
        <div className="placeholder"></div>
          <i style={{marginLeft: '45vw'}} className="fa fa-cog fa-spin fa-3x fa-fw"></i>
          <span className="sr-only" >Loading...</span>
        </div>
      );
    }
    else{

      let tabListAr = [];
      let tabPanelAr = [];
      let workflowsView = null;

      if(!this.state.SubmitButtonShow || this.props.UserID){
        submitButtonView = null;
      }
      if(this.state.WorkflowDetails.length == 1){
        let tasksView = this.state.WorkflowDetails[0].Workflow.map( function(task, index){
          // will probably need to move this into problemDetails.js to support
          // multiple workflows
          if(task.TA_type == TASK_TYPES.NEEDS_CONSOLIDATION){
            return null;
          }
          if(Object.keys(task).length !== 0 ){
          return (<TaskDetailsComponent key={index} index={index}
                                        workflowIndex={0}
                                        TaskActivityData={task}
                                        isOpen={index == 0 ? true : false}
                                        changeNumericData={this.changeNumericData.bind(this)}
                                        changeInputData={this.changeInputData.bind(this)}
                                        changeDropdownData={this.changeDropdownData.bind(this)}
                                        changeTASimpleGradeCheck={this.changeTASimpleGradeCheck.bind(this)}
                                        changeTASimpleGradePoints={this.changeTASimpleGradePoints.bind(this)}
                                        changeInputFieldData={this.changeInputFieldData.bind(this)}
                                        changeNumericFieldData={this.changeNumericFieldData.bind(this)}
                                        changeDropdownFieldData={this.changeDropdownFieldData.bind(this)}
                                        changeFieldName={this.changeFieldName.bind(this)}
                                        changeFieldCheck={this.changeFieldCheck.bind(this)}
                                        changeFileUpload={this.changeFileUpload.bind(this)}
                                        changeDataCheck={this.changeDataCheck.bind(this)}
                                        addFieldButton={this.addFieldButton.bind(this)}
                                        changeRadioData={this.changeRadioData.bind(this)}
                                        changeSimpleGradeCheck={this.changeSimpleGradeCheck.bind(this)}
                                        getReflectNumberofParticipants = {this.getReflectNumberofParticipants.bind(this)}
                                        setReflectNumberofParticipants = {this.setReflectNumberofParticipants.bind(this)}
                                        getAssessNumberofParticipants = {this.getAssessNumberofParticipants.bind(this)}
                                        setAssessNumberofParticipants = {this.setAssessNumberofParticipants.bind(this)}
                                        checkAssigneeConstraints = {this.checkAssigneeConstraints.bind(this)}
                                        checkAssigneeConstraintTasks = {this.checkAssigneeConstraintTasks.bind(this)}
                                        getAlreadyCreatedTasks = {this.getAlreadyCreatedTasks.bind(this)}
                                        changeAssigneeInChild = {this.changeAssigneeInChild.bind(this)}
                                        getAssigneeInChild = { this.getAssigneeInChild.bind(this)}
                                />);
            }
            else{
              return null;
            }
        },this);

        workflowsView = (
          <div>
            <ProblemDetailsComponent workflowIndex={0}
                                     WorkflowDetails={this.state.WorkflowDetails[0]}
                                     NumberofWorkflows = {this.state.AssignmentActivityData.NumberofWorkflows}
                                     changeWorkflowData= {this.changeWorkflowData.bind(this)}
                                     changeWorkflowInputData={this.changeWorkflowInputData.bind(this)}
                                     changeWorkflowDropdownData={this.changeWorkflowDropdownData.bind(this)}
                                     getFinalGradeTasks={this.getFinalGradeTasks.bind(this)}
                                     changeWorkflowGradeDist={this.changeWorkflowGradeDist.bind(this)}
                                     />
            {tasksView}
           </div>)
      }
      else{
        this.state.WorkflowDetails.forEach(function(workflow,index){
          let tasksView = workflow.Workflow.map( function(task, taskIndex){
            // will probably need to move this into problemDetails.js to support
            // multiple workflows
            if(task.TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || task.TA_type == TASK_TYPES.COMPLETED){
              return null;
            }
            if(Object.keys(task).length !== 0 ){
            return (<TaskDetailsComponent key={index + "-" + taskIndex} index={taskIndex}
                                          workflowIndex={index}
                                          TaskActivityData={task}
                                          isOpen={false}
                                          changeNumericData={this.changeNumericData.bind(this)}
                                          changeInputData={this.changeInputData.bind(this)}
                                          changeDropdownData={this.changeDropdownData.bind(this)}
                                          changeTASimpleGradeCheck={this.changeTASimpleGradeCheck.bind(this)}
                                          changeTASimpleGradePoints={this.changeTASimpleGradePoints.bind(this)}
                                          changeInputFieldData={this.changeInputFieldData.bind(this)}
                                          changeNumericFieldData={this.changeNumericFieldData.bind(this)}
                                          changeDropdownFieldData={this.changeDropdownFieldData.bind(this)}
                                          changeFieldName={this.changeFieldName.bind(this)}
                                          changeFieldCheck={this.changeFieldCheck.bind(this)}
                                          changeFileUpload={this.changeFileUpload.bind(this)}
                                          changeDataCheck={this.changeDataCheck.bind(this)}
                                          addFieldButton={this.addFieldButton.bind(this)}
                                          changeRadioData={this.changeRadioData.bind(this)}
                                          changeSimpleGradeCheck={this.changeSimpleGradeCheck.bind(this)}
                                          getReflectNumberofParticipants = {this.getReflectNumberofParticipants.bind(this)}
                                          setReflectNumberofParticipants = {this.setReflectNumberofParticipants.bind(this)}
                                          getAssessNumberofParticipants = {this.getAssessNumberofParticipants.bind(this)}
                                          setAssessNumberofParticipants = {this.setAssessNumberofParticipants.bind(this)}
                                          checkAssigneeConstraints = {this.checkAssigneeConstraints.bind(this)}
                                          checkAssigneeConstraintTasks = {this.checkAssigneeConstraintTasks.bind(this)}
                                          getAlreadyCreatedTasks = {this.getAlreadyCreatedTasks.bind(this)}
                                          changeAssigneeInChild = {this.changeAssigneeInChild.bind(this)}
                                          getAssigneeInChild = {this.getAssigneeInChild.bind(this)}
                                  />);
              }
              else{
                return null;
              }
          },this);

            tabListAr.push(<Tab>{workflow.WA_name}</Tab>);
            tabPanelAr.push(
              <TabPanel>
                <div className="placeholder">
                <ProblemDetailsComponent workflowIndex={index}
                                         WorkflowDetails={workflow}
                                         NumberofWorkflows = {this.state.AssignmentActivityData.NumberofWorkflows}
                                         changeWorkflowData= {this.changeWorkflowData.bind(this)}
                                         changeWorkflowInputData={this.changeWorkflowInputData.bind(this)}
                                         changeWorkflowDropdownData={this.changeWorkflowDropdownData.bind(this)}
                                         getFinalGradeTasks={this.getFinalGradeTasks.bind(this)} />
                 <br />
                 <br />
                 {tasksView}
                </div>
              </TabPanel>);
        },this);

        workflowsView =  (<Tabs onSelect={this.handleSelect.bind(this)}
              selectedIndex={this.state.CurrentWorkflowIndex} >
          <TabList className="big-text">
            {tabListAr}
          </TabList>
          {tabPanelAr}
        </Tabs>);
      }

        return (
          <div>
            {infoMessage}
            <div className='placeholder'></div>
            <AssignmentDetailsComponent AssignmentActivityData={this.state.AssignmentActivityData}
                                        Courses={this.state.Courses}
                                        Semesters = {this.state.Semesters}
                                        changeAssignmentNumeric={this.changeAssignmentNumeric.bind(this)}
                                        changeAssignmentInput={this.changeAssignmentInput.bind(this)}
                                        changeAssignmentDropdown={this.changeAssignmentDropdown.bind(this)}
                                            />
            <br />
            {workflowsView}
            <br />
            {submitButtonView}
        </div>
        );
      }
    }
}

export default AssignmentEditorContainer;
