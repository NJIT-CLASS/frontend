//The main component of the assignment editor. This calls the other components and passes in the methods defined here. The data is all made here and
// will be submitted from this component. This component has no views, it only contains data and components.
//
// TODO
// add TA_minimum_duration: Add number of minutes that a task must last if they start it late
// Assignee constraint second level of checkboxes needs isClicked prop set
import React from 'react';
import request from 'request';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {cloneDeep, clone, isEmpty, indexOf} from 'lodash';

var TreeModel = require('tree-model'); /// references: http://jnuno.com/tree-model-js/  https://github.com/joaonuno/tree-model-js
let FlatToNested = require('flat-to-nested');

import TaskDetailsComponent from './taskDetails';
import AssignmentDetailsComponent from './assignmentDetails';
import ProblemDetailsComponent from './problemDetails';
import confirmModal from './confirmModal';
import {TASK_TYPES, TASK_TYPES_TEXT} from '../../server/utils/react_constants';
import Strings from './assignmentEditorStrings';

class AssignmentEditorContainer extends React.Component {
    constructor(props) {
        super(props);
        /*
        Props:
            - UserID
            - CourseID
            - apiUrl
      */
        //These are the indexes of the nodes in the tree.
        // Defines as consants in case they need to be changed later.
        this.REFLECT_IDX = 0;
        this.ASSESS_IDX = 1;
        this.CONSOL_DISP_IDX = 2;
        this.CREATE_IDX = 3;
        this.SOLVE_IDX = 4;

        this.tree = new TreeModel(); //this is the tree making object. It is not a tree structure but has the tree methods
        this.root = this.tree.parse({id: 0, isSubWorkflow: 0}); // this is the root of the tree structure. A copy is made for each workflow
        this.nullNode = this.tree.parse({id: -1}); // this is the null Node template, it has an id of -1
        this.defaultFields = {
            title: 'Field',
            show_title: false,
            assessment_type: null,
            numeric_min: 0,
            numeric_max: 40,
            rating_max: 5,
            list_of_labels: ['Easy', 'Medium', 'Difficult'],
            field_type: 'text',
            requires_justification: false,
            instructions: '',
            rubric: '',
            justification_instructions: '',
            default_refers_to: [
                null, null
            ],
            default_content: ['', '']
        };



        var createTaskObject = function(taskOptionsObject) {
            let newTask = {
                TA_display_name: '',
                TA_type: '',
                TA_documentation:'',
                VersionEvaluation: 'first', // 'first','last','whole'
                SeeSibblings: false,
                SeeSameActivity: true,
                TA_name: '',
                TA_overall_instructions: '',
                TA_overall_rubric: '',
                TA_fields: {},
                SimpleGradePointReduction: 0,
                AllowConsolidations: [
                    false, false
                ],
                StartDelay: false,
                TA_file_upload: {'mandatory': 0, 'optional': 0},
                TA_due_type: [
                    'duration', 4320
                ],
                TA_start_delay: 0,
                TA_at_duration_end: 'late',
                TA_what_if_late: 'keep_same_participant',

                TA_one_or_separate: false,
                TA_assignee_constraints: [
                    '', '', {}
                ],
                TA_simple_grade: 'none',
                TA_is_final_grade: false,

                TA_allow_reflection: [
                    'none', 'don\'t wait'
                ],
                TA_allow_assessment: 'none',
                TA_allow_revisions: false,
                TA_number_participant: 1,
                TA_function_type: 'max',
                TA_allow_dispute: false,
                TA_trigger_consolidation_threshold: [],
                TA_leads_to_new_problem: false,
                TA_leads_to_new_solution: false
            };

            if(taskOptionsObject !== undefined && taskOptionsObject.constructor === Object){
                Object.keys(taskOptionsObject).forEach((key) => {
                    newTask[key] = taskOptionsObject[key];
                });
            }

            return newTask;
        };

        //////////// Defining all Task Types Here /////////
        this.createProblemTask = createTaskObject({
            TA_display_name: 'Create Problem',
            TA_type: TASK_TYPES.CREATE_PROBLEM,
            TA_name: TASK_TYPES_TEXT.CREATE_PROBLEM,
            VersionEvaluation: 'last',
            TA_what_if_late: 'keep_same_participant',
            TA_one_or_separate: false,
            TA_assignee_constraints: [
                'student', 'individual', {}
            ],
            TA_overall_instructions: 'Create a new problem for another student to solve.',
            TA_number_participant: 1,
            TA_function_type: 'max',
            TA_fields: {
                number_of_fields: 1,
                field_titles: ['Problem 1'],
                0: {
                    title: 'Problem 1',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: ['Easy', 'Medium', 'Difficult'],
                    field_type: 'text',
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
        });

        this.editProblemTask = createTaskObject({
            TA_display_name: 'Edit Problem',
            TA_type: TASK_TYPES.EDIT,
            TA_name: TASK_TYPES_TEXT.EDIT,
            TA_overall_instructions: 'Edit the problem to ensure that it makes sense.',
            VersionEvaluation: 'whole',
            TA_assignee_constraints: [
                'instructor',
                'individual', {
                    'not_in_workflow_instance': []
                }
            ],
            TA_fields: {
                number_of_fields: 1,
                field_titles: ['Field'],
                0: {
                    title: 'Field',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: ['Easy', 'Medium', 'Difficult'],
                    field_type: 'text',
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
        });

        this.commmentProblemTask = createTaskObject({
            TA_display_name: 'Comment on Problem',
            TA_type: TASK_TYPES.COMMENT,
            TA_name: TASK_TYPES_TEXT.COMMENT,
            TA_overall_instructions: 'Comment on the problem.',
            VersionEvaluation: 'whole',
            TA_assignee_constraints: [
                'student',
                'group', {
                    'not_in_workflow_instance': []
                }
            ],
            TA_allow_reflection: [
                'none', 'don\'t wait'
            ],
            TA_fields: {
                number_of_fields: 1,
                field_titles: ['Field'],
                0: {
                    title: 'Field',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: ['Easy', 'Medium', 'Difficult'],
                    field_type: 'text',
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
        });

        this.solveProblemTask = createTaskObject({
            TA_display_name: 'Solve the Problem',
            TA_type: TASK_TYPES.SOLVE_PROBLEM,
            TA_name:  TASK_TYPES_TEXT.SOLVE_PROBLEM,
            TA_overall_instructions: 'Solve the problem.',
            VersionEvaluation: 'last',
            TA_assignee_constraints: ['student',
                'individual', {}
            ],
            TA_fields: {
                number_of_fields: 1,
                field_titles: ['Solution'],
                0: {
                    title: 'Solution',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: ['Easy', 'Medium', 'Difficult'],
                    field_type: 'text',
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
        });

        this.gradeSolutionTask = createTaskObject({
            TA_display_name: 'Grade the Solution',
            TA_type: TASK_TYPES.GRADE_PROBLEM,
            TA_name: TASK_TYPES_TEXT.GRADE_PROBLEM,
            TA_assignee_constraints: [
                'student',
                'individual', {}
            ],
            TA_is_final_grade: true,
            TA_number_participant: 2,
            TA_fields: {
                number_of_fields: 2,
                field_titles: ['Correctness','Completeness'],
                0: {
                    title: 'Correctness',
                    show_title: true,
                    assessment_type: 'grade',
                    numeric_min: 0,
                    numeric_max: 50,
                    rating_max: 5,
                    list_of_labels: ['Easy', 'Medium', 'Difficult'],
                    field_type: 'assessment',
                    requires_justification: true,
                    instructions: 'Grade the solution on how correct it is.',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [
                        null, null
                    ],
                    default_content: ['', '']
                },
                1: {
                    title: 'Completeness',
                    show_title: true,
                    assessment_type: 'grade',
                    numeric_min: 0,
                    numeric_max: 50,
                    rating_max: 5,
                    list_of_labels: ['Easy', 'Medium', 'Difficult'],
                    field_type: 'assessment',
                    requires_justification: true,
                    instructions: 'Grade the solution on whether you feel it completely answered the problem.',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [
                        null, null
                    ],
                    default_content: ['', '']
                }
            }
        });

        this.critiqueSolutionTask = createTaskObject({
            TA_display_name: 'Critique the Solution',
            TA_type: TASK_TYPES.CRITIQUE,
            TA_documentation:'',
            TA_name: TASK_TYPES_TEXT.CRITIQUE,
            TA_assignee_constraints: [
                'student',
                'individual', {}
            ],
            TA_is_final_grade: true,
            TA_number_participant: 1,
            TA_fields: {
                number_of_fields: 1,
                field_titles: ['Critique'],
                0: {
                    title: 'Critique',
                    show_title: false,
                    assessment_type: 'numeric',
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: ['Easy', 'Medium', 'Difficult'],
                    field_type: 'assessment',
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
        });

        this.needsConsolidationTask = createTaskObject({
            TA_display_name: 'Needs Consolidation',
            TA_type: TASK_TYPES.NEEDS_CONSOLIDATION,
            TA_documentation:'',
            TA_name: TASK_TYPES_TEXT.NEEDS_CONSOLIDATION,
            TA_number_participant: 1,
            TA_assignee_constraints: [
                'student',
                'individual', {'same_as': [2]}
            ],
            TA_trigger_consolidation_threshold: [15,'percent'],
            TA_fields: null
        });

        this.consolidationTask = createTaskObject({
            TA_display_name: 'Consolidate',
            TA_type: TASK_TYPES.CONSOLIDATION,
            TA_overall_instructions: 'Consolidate the different grades into a single, fair grade.',
            TA_name: TASK_TYPES_TEXT.CONSOLIDATION,
            TA_assignee_constraints: [
                'student',
                'individual', {'same_as': [2]}
            ],
            TA_is_final_grade: true,
            TA_fields: {
                number_of_fields: 0,
                field_titles: []
            }
        });

        this.disputeTask = createTaskObject({
            TA_display_name: 'Dispute the Grades',
            TA_type: TASK_TYPES.DISPUTE,
            TA_name: TASK_TYPES_TEXT.DISPUTE,
            TA_overall_instructions: 'Decide whether to dispute your grade or not. If you do, you must justify your grades.',
            TA_at_duration_end: 'resolved',
            TA_what_if_late: null,
            TA_assignee_constraints: [
                'student',
                'individual', {}
            ],
            TA_fields: {
                number_of_fields: 0,
                field_titles: []
            }
        });

        this.resolveDisputeTask = createTaskObject({
            TA_display_name: 'Resolve the Dispute',
            TA_type: TASK_TYPES.RESOLVE_DISPUTE,
            TA_name: TASK_TYPES_TEXT.RESOLVE_DISPUTE,
            TA_assignee_constraints: [
                'instructor',
                'individual', {}
            ],
            TA_is_final_grade: true,
            TA_fields: {
                number_of_fields: 0,
                field_titles: []
            }
        });

        this.completeTask = createTaskObject({
            TA_display_name: 'Complete',
            TA_type: TASK_TYPES.COMPLETED,
            TA_documentation:'',
            TA_name: TASK_TYPES_TEXT.COMPLETED,
            TA_assignee_constraints: [
                'student', 'individual', {}
            ],
            TA_fields: null
        });
        ///----------------------

        let standardWorkflow = [cloneDeep(this.createProblemTask)];

        //template for the standard workflow
        this.blankWorkflow = {
            WA_name: 'Problem',
            WA_type: '',
            WA_number_of_sets: 1,
            WA_documentation: '',
            WA_default_group_size: 1,
            WA_grade_distribution: {},
            NumberOfGradingTask: 0,
            Workflow: standardWorkflow,
            WorkflowStructure: cloneDeep(this.root) //this is the tree structure for that particular workflow
        };

        this.state = {
            CurrentWorkflowIndex: 0,
            LastTaskChanged: 0,
            SelectedTask:0,
            SubmitSuccess: false,
            ResumingFromSaved: false,
            SubmitButtonShow: true,
            SaveSuccess: false,
            SubmitError: false,
            Loaded: false,
            Courses: null,
            Semesters: null,
            PartialAssignmentID: this.props.PartialAssignmentID != '' ? this.props.PartialAssignmentID : null,
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
            WorkflowDetails: [cloneDeep(this.blankWorkflow)],
            Strings: Strings
        };
    }

    componentWillMount() {
        //get components and semesters

        let coursesArray = null;
        let semestersArray = null;

        //Get the translated Strings
        this.props.__(this.state.Strings, (newStrings) => {
            this.setState({Strings: newStrings});
        });

        //Get the semesters
        const semesterOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/semester',
            json: true
        };
        request(semesterOptions, (err, res, body) => {
            semestersArray = body.Semesters.map(function(sem) {
                return ({value: sem.SemesterID, label: sem.Name});
            });
            semestersArray.push({value: null, label: 'All'});
            this.setState({
                Semesters: semestersArray
            });
        });

        //Get courses if one was not already chosen
        if (this.props.CourseID === '*' || this.props.CourseID === '') {
            const coursesOptions = {
                method: 'GET',
                uri: this.props.apiUrl + '/api/getCourseCreated/' + this.props.UserID,
                json: true
            };
            request(coursesOptions, (err, res, bod) => {
                coursesArray = bod.Courses.map(function(course) {
                    return ({value: course.CourseID, label: course.Name});
                });
                this.setState({
                    Courses: coursesArray
                });
            });
        }else{
            this.setState({
                CourseID: this.props.CourseID
            });
        }

        //Load partially made assignment from the database
        if(this.props.PartialAssignmentID !== ''){
            const assignmentOptions = {
                method: 'GET',
                uri: this.props.apiUrl + '/api/partialAssignments/ById/' + this.props.PartialAssignmentID,
                qs: {
                    userId: this.props.UserID,
                    courseId: this.props.CourseID === '*' ? undefined : this.props.CourseID
                },
                json: true
            };

            console.log(assignmentOptions);

            request(assignmentOptions, (err3, res3, assignBody) => {
                console.log(assignBody, res3);

                if(res3.statusCode !== 200 || assignBody == null || assignBody.PartialAssignment == null || assignBody.PartialAssignment.Data == null){
                    return;
                }
                this.onLoad(JSON.parse(assignBody.PartialAssignment.Data));
            });
        }


    }

    // findMainGradeTask(workflow, workflowStructure, workflowIndex){
    //   workflowStructure.walk({strategy: 'breadth'}, function (node) {
    //     if (node.model.id === 121)
    //       return false;
    //   });
    // }
    clearCurrentStructure(workflowIndex){
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].WorkflowStructure = cloneDeep(this.root);
        newData[workflowIndex].Workflow = [cloneDeep(this.blankWorkflow)];
        return this.setState({WorkflowDetails: newData});
    }

    makeDefaultWorkflowStructure(workflowIndex){
      //this sets the default problem structure
        this.changeDataCheck('TA_allow_reflection', 0, workflowIndex);
        this.changeDataCheck('TA_leads_to_new_solution', 0, workflowIndex);
        this.changeDataCheck('TA_allow_assessment', 2, workflowIndex);
        this.changeDataCheck('Assess_Consolidate', 2, workflowIndex);
        this.changeDataCheck('Assess_Dispute', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(1, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(2, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(2, 'not', 1, workflowIndex);
        this.checkAssigneeConstraintTasks(3, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(3, 'same_as', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(4, 'same_as', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(5, 'not', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(5, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(5, 'not', 3, workflowIndex);
        this.checkAssigneeConstraintTasks(6, 'same_as', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(7, 'not', 2, workflowIndex);
    }

    componentDidMount() {
        if(this.state.PartialAssignmentID){
            return this.setState({ Loaded: true});
        }else{
            this.makeDefaultWorkflowStructure(0);
            return this.setState({ Loaded: true});
        }



    }

    makeSubWorkflows(root, workflowArray, workflowIndex){
        let reflectClass = [TASK_TYPES.EDIT, TASK_TYPES.COMMENT];
        let assessClass = [TASK_TYPES.GRADE_PROBLEM, TASK_TYPES.CRITIQUE];
        let consolClass = [TASK_TYPES.NEEDS_CONSOLIDATION, TASK_TYPES.CONSOLIDATION];
        let disputeClass = [TASK_TYPES.DISPUTE, TASK_TYPES.RESOLVE_DISPUTE];
        let consolDispClass = [...consolClass, ...disputeClass];

        root.walk(function(node){
            if(node.model.id == -1){
                return;
            }

            let defaults = null; // if task is of these types, same 'subworkflow level'
            switch(workflowArray[node.model.id].TA_type){

            case TASK_TYPES.EDIT:
            case TASK_TYPES.COMMENT:
                defaults = consolDispClass;
                break;
            case TASK_TYPES.GRADE_PROBLEM:
            case TASK_TYPES.CRITIQUE:
                defaults = consolDispClass;
                break;
            case TASK_TYPES.NEEDS_CONSOLIDATION:
            case TASK_TYPES.CONSOLIDATION:
            case TASK_TYPES.DISPUTE:
            case TASK_TYPES.RESOLVE_DISPUTE:
                defaults = consolDispClass;
                break;

            case TASK_TYPES.CREATE_PROBLEM:
                defaults = [...reflectClass, TASK_TYPES.SOLVE_PROBLEM];
                break;
            case TASK_TYPES.SOLVE_PROBLEM:
                defaults = assessClass;
                break;
            }

            node.children.forEach(function(child){
                if(child.model.id == -1){
                    return;
                }
                let childType = workflowArray[child.model.id].TA_type;
                if(!defaults.includes(childType)){ //means its not one of the defaults, aka new subworkflow
                    child.model['isSubWorkflow'] = node.model.isSubWorkflow + 1;
                }
                else{
                    child.model['isSubWorkflow'] = node.model.isSubWorkflow;
                }
            });

        });

        return root;
    }

    flattenTreeStructure(root){
        let flatty = [];
        root.walk({strategy: 'pre'}, function(task) {
            let ob = new Object();
            if(task.parent !== undefined){
                ob['parent'] = task.parent.model.id;
            }
            ob['id'] = task.model.id;
            ob['isSubWorkflow'] = task.model.isSubWorkflow;

          //ob = { ...task.model};

            flatty.push(ob);
        }, this);

        return flatty;
    }

    unflattenTreeStructure(flatTreeArray){
        let flatToNested = new FlatToNested();
        let nestedTreeObj = flatToNested.convert(flatTreeArray);
        let treeRoot = this.tree.parse(nestedTreeObj);
        return treeRoot;
    }

    onLoad(assignmentData){
        let workflowData = clone(assignmentData.WorkflowActivity);
        delete assignmentData['WorkflowActivity'];
        let AA_Data = assignmentData;
        workflowData.forEach((workflow, index) => {
            workflow.WorkflowStructure = this.unflattenTreeStructure(workflow.WorkflowStructure);
        })
;
        this.setState({
            AssignmentActivityData: assignmentData,
            WorkflowDetails: workflowData
        });
    }

    onSave(){
        //Save Partiallly cocmpleted assignment data to database
        //Done in stages:
            //1. Flatten all Workflow trees
            //2. Send to database.
            //3. Show some kind of acknowledgement messageDiv
            //
        if(this.state.SubmitSuccess === true){
            return;
        }

        if (this.state.AssignmentActivityData.AA_course === null || isNaN(this.state.AssignmentActivityData.AA_course)) {
            console.log('CourseID null');
            this.setState({SubmitError: true});
            return;
        }
        let sendData = cloneDeep(this.state.AssignmentActivityData);
        sendData.WorkflowActivity = cloneDeep(this.state.WorkflowDetails);
        sendData.WorkflowActivity.forEach((workflow, index) => {
            workflow.WorkflowStructure = this.flattenTreeStructure(workflow.WorkflowStructure);

        });

        console.log(sendData);

        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/assignment/save',
            body: {
                assignment: sendData,
                userId: this.props.UserID,
                partialAssignmentId: this.state.PartialAssignmentID,
                courseId: this.state.CourseID
            },
            json: true
        };

        request(options, (err, res, body) => {
            if (err == null && res.statusCode == 200) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                console.log(body);
                this.setState({
                    PartialAssignmentID: body.PartialAssignmentID,
                    SaveSuccess: true
                });
            } else {
                console.log('');
                this.setState({SaveError: true});
            }

        });

    }
    onSubmit() {
      /*
        When submitting the data to the backend, the workflow structure
        (tree object) must be cleaned and flattened. This function will:
          A. Check for CourseID not null.
          B. For each workflow:
              1. Clean the Workflow array of empty tasks and add WF Complete.
              2. Go through the WorkflowStructure tree to add Subworkflow label
              3. Go through the array structure to clean IDs in AssigneeConstraints,
                  and Fields Objects.
              4. Go through Grade Distribution to clean IDs
              5. Link Task Fields
              6. Convert WorkflowStructure into flattened object for storage
                  in DB.
          C. Send to DB.
      */

        if(this.state.SubmitSuccess === true){
            return;
        }

        if (this.state.AssignmentActivityData.AA_course === null || isNaN(this.state.AssignmentActivityData.AA_course)) {
            console.log('CourseID null');
            this.setState({SubmitError: true});
            return;
        }
        //Place Workflows in AssignmentActivityData object for compatability with backend call
        let sendData = cloneDeep(this.state.AssignmentActivityData);
        sendData.WorkflowActivity = cloneDeep(this.state.WorkflowDetails);

        ///////// Reduce array and tree into usable parts
        let reflectClass = [TASK_TYPES.EDIT, TASK_TYPES.COMMENT];
        let assessClass = [TASK_TYPES.GRADE_PROBLEM, TASK_TYPES.CRITIQUE];
        let consolDispClass = [TASK_TYPES.NEEDS_CONSOLIDATION,TASK_TYPES.CONSOLIDATION, TASK_TYPES.DISPUTE, TASK_TYPES.RESOLVE_DISPUTE];
        const nodeEmpty = (node) =>{
            if(node.children.length === 0){
                return true;
            }
            node.children.forEach((child) => {
                if(child.mode.id === -1){
                    return false;
                }
            });
            return true;
        };

        sendData.WorkflowActivity.forEach((workflow, index) => {


          // B.1 Clean Workflow array
            let counter = 0;
            let mapping = {}; //new IDs of tasks after B.1
            let newWorkflow = new Array();

            workflow.WorkflowStructure.walk({strategy: 'pre'}, function(task) {
                if(task.model.id == -1)
                    return;

                mapping[task.model.id] = counter;
                newWorkflow.push(workflow.Workflow[task.model.id]);
                task.model.id = counter;
                counter += 1;
            });

            workflow.WorkflowStructure.walk((node) => {
                if(node.model.id == -1) return;
            });

            // newWorkflow.push(this.createNewCompleteTask(index));
            workflow.Workflow = newWorkflow;

            workflow.WorkflowStructure.walk((node) => {
                if(node.model.id == -1) return;
            });
            console.log(workflow.Workflow, workflow.WorkflowStructure);

          // B.2 Add Subworkflow labels
            workflow.WorkflowStructure = this.makeSubWorkflows(workflow.WorkflowStructure,workflow.Workflow, index);

            workflow.WorkflowStructure.walk((node) => {
                if(node.model.id == -1) return;
            });


          // B.3 Clean IDs in AssigneeConstraints and Fields

            workflow.Workflow.forEach(function(task) {
                Object.keys(task.TA_assignee_constraints[2]).forEach(function(constr) {
                    task.TA_assignee_constraints[2][constr] = task.TA_assignee_constraints[2][constr].map(function(id) {
                        return (mapping[id]);
                    });
                });

                if(task.TA_fields){
                    for(let k = 0; k < task.TA_fields.number_of_fields; k++){ //clean default refers to in TA_fields
                        if(!task.TA_fields[k].default_refers_to[0]){
                            task.TA_fields[k].default_refers_to[0] = mapping[task.TA_fields[k].default_refers_to[0]];
                        }
                    }
                }

              //Make Number of Students accurately reflect number of participants
                if(task.TA_assignee_constraints[0] == 'instructor'){
                    task.TA_number_participant = 1;
                }
                else if(task.TA_assignee_constraints[0] == 'both'){
                    task.TA_number_participant += 1;
                }
            });

          // B.4 Clean GradeDistribution
            let newGradeDist = new Object();
            Object.keys(workflow.WA_grade_distribution).forEach(function(taskKey) {
                newGradeDist[mapping[taskKey]] = workflow.WA_grade_distribution[taskKey];
            });

            workflow.WA_grade_distribution = newGradeDist;

          // B5 Link Fields in Tasks
            let taskTypesToLink = [TASK_TYPES.CONSOLIDATION, TASK_TYPES.DISPUTE, TASK_TYPES.RESOLVE_DISPUTE];
            let taskstoLink = workflow.Workflow.map((task,index) => {
                if(taskTypesToLink.includes(task.TA_type)){
                    return index;
                }
                else{
                    return -1;
                }
            }).filter(function(taskIndex){
                return taskIndex != -1;
            });

            taskstoLink.forEach((taskIndex) => {
                workflow.Workflow = this.addLinkedTaskFields(workflow.WorkflowStructure, workflow.Workflow, taskIndex);
            });


          // B.6 Flatten workflow

            workflow.WorkflowStructure = this.flattenTreeStructure(workflow.WorkflowStructure);

          //-----------------------------------------
        }, this);


        console.log(sendData);


        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/assignment/create',
            body: {
                assignment: sendData,
                userId: this.props.UserID,
                partialAssignmentId: this.state.PartialAssignmentID
            },
            json: true
        };

        request(options, (err, res, body) => {
            if (err == null && res.statusCode == 200) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                this.setState({SubmitSuccess: true, SubmitButtonShow: false});
            } else {
                console.log('Submit failed');
                this.setState({SubmitError: true});
            }

        });
    }
    ///////////////////////////////////////////////////////////////////////////
    ////////////// Tree Methods //////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //The root of the tree is this.root. Each node can be modeled as a node with up to five children:
    // 1st Child - Reflection Type
    // 2nd Child - Assessment Type
    // 3rd Child - (Needs Consolidation and Consolidation) && || (Dispute and Resolve Dispute)
    // 4th Child - Create Problem
    // 5th Child - Solve Problem
    // These indexes are rigid, so non-occupied branches are filles with this.nullNode

    fillGaps(node, index) {
        for (let i = 0; i < index; i++) {
            if (node.children[i] === undefined) {
                node.addChildAtIndex(clone(this.nullNode), i);
            }
        }
        return node;
    }

    addTask(stateData, type, index, workflowIndex) {
        let newTask = null;

        switch (type) {
        case this.ASSESS_IDX:
            newTask = this.createNewTask(this.gradeSolutionTask, index, workflowIndex, 'Grade');
            break;
        case this.REFLECT_IDX:
            newTask = this.createNewTask(this.editProblemTask, index, workflowIndex, 'Edit');
            break;
        case this.CREATE_IDX:
            newTask = this.createNewTask(this.createProblemTask, index, workflowIndex, 'Create');
            break;
        case this.SOLVE_IDX:
            newTask = this.createNewTask(this.solveProblemTask, index, workflowIndex, 'Solve');
            break;
        }

        stateData[workflowIndex].Workflow.push(newTask);

        var selectedNode = stateData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == index;
        });

        let newNode = this.tree.parse({
            id: stateData[workflowIndex].Workflow.length - 1
        });

        if (selectedNode.children[type] === undefined) {
            selectedNode = this.fillGaps(selectedNode, type);
            selectedNode.addChildAtIndex(newNode, type);
        } else {
            let dropped = selectedNode.children[type].drop();

            selectedNode.addChildAtIndex(newNode, type);
        }

        return stateData;
    }

    taskChildren(taskIndex, workflowIndex){
        let childrenNames = [];
        let selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first((node) => {
            return node.model.id == taskIndex;
        });
        selectedNode.walk((node) => {
            if(node.model.id != -1){
                childrenNames.push(this.state.WorkflowDetails[workflowIndex].Workflow[node.model.id].TA_display_name);
            }
        });
        return childrenNames;
    }

    addConsolidation(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });
        let needsConsolData = this.createNewTask(this.needsConsolidationTask, parentIndex, workflowIndex, 'Needs Consolidation of');
        let consolData = this.createNewTask(this.consolidationTask, parentIndex, workflowIndex, 'Consolidate');


        needsConsolData.TA_assignee_constraints = ['student', 'individual', {'same_as': [parentIndex]}];
        consolData.TA_assignee_constraints = ['student', 'individual', {'same_as': [parentIndex]}];

        newData[workflowIndex].Workflow.push(needsConsolData);
        newData[workflowIndex].Workflow.push(consolData);

        let needsConsolidateNode = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 2
        });

        let consolidateNode = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 1
        });
        needsConsolidateNode = this.fillGaps(needsConsolidateNode, this.CONSOL_DISP_IDX);
        needsConsolidateNode.addChildAtIndex(consolidateNode, this.CONSOL_DISP_IDX);



        selectedNode = this.fillGaps(selectedNode, this.CONSOL_DISP_IDX);
        if (selectedNode.children[this.CONSOL_DISP_IDX] == undefined) {
            selectedNode.addChildAtIndex(needsConsolidateNode, this.CONSOL_DISP_IDX);
        } else if (selectedNode.children[this.CONSOL_DISP_IDX].model.id == -1) {
            selectedNode.children[this.CONSOL_DISP_IDX].drop();
            selectedNode.addChildAtIndex(needsConsolidateNode, this.CONSOL_DISP_IDX);
        } else {
            let temp = selectedNode.children[this.CONSOL_DISP_IDX].drop();
            //fillGaps
            needsConsolidateNode.children[this.CONSOL_DISP_IDX] = this.fillGaps(needsConsolidateNode.children[this.CONSOL_DISP_IDX], this.CONSOL_DISP_IDX);
            needsConsolidateNode.children[this.CONSOL_DISP_IDX].addChildAtIndex(temp, this.CONSOL_DISP_IDX);
            selectedNode.addChildAtIndex(needsConsolidateNode, this.CONSOL_DISP_IDX);
        }

        this.setState({WorkflowDetails: newData});
    }

    canConsolidate(taskIndex,workflowIndex, isReflect){

        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == (isReflect ? this.getReflectIndex(taskIndex, workflowIndex) : this.getAssessIndex(taskIndex,workflowIndex));
        },this);

        if(selectedNode.children.length == 0 || selectedNode.children[this.CONSOL_DISP_IDX] == undefined || selectedNode.children[this.CONSOL_DISP_IDX].model.id == -1){
            return false;
        }

        if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[this.CONSOL_DISP_IDX].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION){
            return true;
        } else {
            return false;
        }
    }

    canDispute(taskIndex,workflowIndex, isReflect){

        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == (isReflect ? this.getReflectIndex(taskIndex, workflowIndex) : this.getAssessIndex(taskIndex,workflowIndex));
        }, this);

        if(selectedNode.children.length == 0 || selectedNode.children[this.CONSOL_DISP_IDX] == undefined || selectedNode.children[this.CONSOL_DISP_IDX].model.id == -1){
            return false;
        }
        else if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[this.CONSOL_DISP_IDX].model.id].TA_type == TASK_TYPES.DISPUTE ){
            return true;
        } else {
            if(selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].children.length == 0 || selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].model.id == -1){
                return false;
            }
            else if( this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].model.id].TA_type == TASK_TYPES.DISPUTE){
                return true;
            }else{
                return false;
            }
        }
    }

    addDispute(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;

        newData[workflowIndex].Workflow.push(this.createNewTask(this.disputeTask, parentIndex, workflowIndex, 'Dispute of '));
        newData[workflowIndex].Workflow.push(this.createNewTask(this.resolveDisputeTask, parentIndex, workflowIndex, 'Resolve Dispute of'));

        let disputeNode = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 2
        });
        let resolveNode = this.tree.parse({
            id: newData[workflowIndex].Workflow.length - 1
        });

        disputeNode = this.fillGaps(disputeNode, this.CONSOL_DISP_IDX);
        disputeNode.addChildAtIndex(resolveNode, this.CONSOL_DISP_IDX);

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        selectedNode = this.fillGaps(selectedNode, this.CONSOL_DISP_IDX);

        if (selectedNode.children[this.CONSOL_DISP_IDX] === undefined) {
            selectedNode.addChildAtIndex(disputeNode, this.CONSOL_DISP_IDX);

        } else if (selectedNode.children[this.CONSOL_DISP_IDX].model.id == -1) {
            selectedNode.children[this.CONSOL_DISP_IDX].drop();
            selectedNode.addChildAtIndex(disputeNode, this.CONSOL_DISP_IDX);
        } else {
            let temp = selectedNode.children[this.CONSOL_DISP_IDX].drop();
            temp.children[this.CONSOL_DISP_IDX] = this.fillGaps(temp.children[this.CONSOL_DISP_IDX], this.CONSOL_DISP_IDX);
            temp.children[this.CONSOL_DISP_IDX].addChildAtIndex(disputeNode, this.CONSOL_DISP_IDX);
            selectedNode.addChildAtIndex(temp, this.CONSOL_DISP_IDX);
        }
        this.setState({WorkflowDetails: newData});

    }

    changeAssessment(parentIndex, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;

        let changeIndex = this.getAssessIndex(parentIndex, workflowIndex);
        let newTask = {};

        if (value == 'grade') {
            newTask = this.createNewTask(this.gradeSolutionTask, parentIndex, workflowIndex, 'Grade');
        } else if (value == 'critique') {
            newTask = this.createNewTask(this.critiqueSolutionTask, parentIndex, workflowIndex, 'Critique');
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
            newTask = this.createNewTask(this.commmentProblemTask, parentIndex, workflowIndex, 'Comment on');
        } else if (value == 'edit') {
            newTask = this.createNewTask(this.editProblemTask, parentIndex, workflowIndex, 'Edit');
        }

        newData[workflowIndex].Workflow[changeIndex] = newTask;

        this.setState({WorkflowDetails: newData});
    }

    createNewTask(taskType, index, workflowIndex, string) {
        let prevTaskName = this.state.WorkflowDetails[workflowIndex].Workflow[index].TA_name;
        let newTask = cloneDeep(taskType);
        let newText = string + ' ' + prevTaskName;
        if (newText.length > 254) { //need to do this because of database limit
            switch (taskType.TA_type) {
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
        newTask.TA_name = string + ' ' + prevTaskName;
        newTask.TA_display_name = newText;
        return newTask;
    }

    getAssessIndex(parentIndex, workflowIndex) {
        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });
        if(selectedNode.children.length == 0 || selectedNode.children[this.ASSESS_IDX] == undefined || selectedNode.children[this.ASSESS_IDX].model.id == -1){
            return -1;
        }
        return selectedNode.children[this.ASSESS_IDX].model.id;

    }

    getConsolidationIndex(reflect, index, workflowIndex) {
        let targetIndex = null;
        if (reflect) {
            targetIndex = this.getReflectIndex(index, workflowIndex);
        } else {
            targetIndex = this.getAssessIndex(index, workflowIndex);
        }

        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == targetIndex;
        });

        if (selectedNode.children[this.CONSOL_DISP_IDX] !== undefined) {
            return selectedNode.children[this.CONSOL_DISP_IDX].model.id;
        } else {
            return null;
        }
    }

    getAssessNumberofParticipants(index, workflowIndex) {
        let x = this;
        if(this.getAssessIndex(index, workflowIndex) == -1){
            return -1;
        }
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

        if(selectedNode.children.length == 0 || selectedNode.children[this.REFLECT_IDX] == undefined || selectedNode.children[this.REFLECT_IDX].model.id == -1){
            return -1;
        }
        return selectedNode.children[this.REFLECT_IDX].model.id;
    }

    getCreateIndex(parentIndex, workflowIndex){
        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if(selectedNode.children.length == 0 || selectedNode.children[this.CREATE_IDX] == undefined || selectedNode.children[this.CREATE_IDX].model.id == -1){
            return -1;
        }else{
            return selectedNode.children[this.CREATE_IDX].model.id;
        }
    }

    getSolveIndex(parentIndex, workflowIndex){
        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if(selectedNode.children.length == 0 || selectedNode.children[this.SOLVE_IDX] == undefined || selectedNode.children[this.SOLVE_IDX].model.id == -1){
            return -1;
        }else{
            return selectedNode.children[this.SOLVE_IDX].model.id;
        }
    }

    getReflectNumberofParticipants(index, workflowIndex) {
        let x = this; //root.first changes this context, so need to save it here

        if(this.getReflectIndex(index, workflowIndex) == -1){
            return -1;
        }

        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === x.getReflectIndex(index, workflowIndex);
        });

        return this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant;
    }

    hasDispute(consoleNode, workflowIndex) {
        if (consoleNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX] === undefined || consoleNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].model.id == -1) {
            return null;
        } else if (this.state.WorkflowDetails[workflowIndex].Workflow[consoleNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].model.id].TA_type == TASK_TYPES.DISPUTE) {

            return consoleNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX];
        } else {

            return null;
        }
    }

    removeTask(stateData, type, index, workflowIndex) {
        let x = this;
        var selectedNode = stateData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == index;
        });

        let dropped = selectedNode.children[type].drop();

        dropped.walk(function(node) {
            stateData = x.cleanAssigneeConstraints(stateData, node.model.id, workflowIndex);
            stateData[workflowIndex].Workflow[node.model.id] = {};
        });

        selectedNode.addChildAtIndex(clone(this.nullNode), type);

        return stateData;

    }

    removeConsolidation(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (selectedNode.children.length == 0 || selectedNode.children[this.CONSOL_DISP_IDX] == undefined) {
            return;
        }
        let x = this; //context variable
        let needsConsoleIndex = selectedNode.children[this.CONSOL_DISP_IDX].model.id;
        let consoleIndex = selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].model.id;
        let dispNode = this.hasDispute(selectedNode.children[this.CONSOL_DISP_IDX], workflowIndex);
        let dropped = selectedNode.children[this.CONSOL_DISP_IDX].drop();
        if (dispNode !== null) {
            dropped.walk(function(node) {
                if (node.model.id == dispNode.model.id) {
                    return false;
                }
                if (node.model.id != -1) {
                    newData[workflowIndex].Workflow[node.model.id] = {};
                }
            });

            selectedNode.addChildAtIndex(dispNode, this.CONSOL_DISP_IDX);

        } else {
            dropped.walk(function(node) {
                if (node != x.nullNode) {
                    newData[workflowIndex].Workflow[node.model.id] = {};
                }
            });
            selectedNode.addChildAtIndex(clone(this.nullNode), this.CONSOL_DISP_IDX);

        }

        this.setState({WorkflowDetails: newData});
    }

    removeDispute(parentIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let x = this; //context preserving variable
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });

        if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[this.CONSOL_DISP_IDX].model.id].TA_type == TASK_TYPES.DISPUTE) {
            let dropped = selectedNode.children[this.CONSOL_DISP_IDX].drop();
            dropped.walk(function(node) {
                if (node.model.id != -1) {
                    newData[workflowIndex].Workflow[node.model.id] = {};
                }
            });
            selectedNode.addChildAtIndex(clone(this.nullNode), this.CONSOL_DISP_IDX);
        } else {
            let dropped = selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].drop();
            dropped.walk(function(node) {
                if (node.model.id != -1) {
                    newData[workflowIndex].Workflow[node.model.id] = {};
                }
            });

            selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].addChildAtIndex(clone(this.nullNode), this.CONSOL_DISP_IDX);
        }

        this.setState({WorkflowDetails: newData});
    }

    setAssessNumberofParticipants(index, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        let x = this; //root.first changes this context, so need to save it here

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
    //--------------------END TREE METHODS--------------------------------------

    ///////////////////////////////////////////////////////////////////////////
    ////////////// Task Activity change methods //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    getParentID(root, workflowData, taskIndex){
        let excludedTasks = [TASK_TYPES.NEEDS_CONSOLIDATION,TASK_TYPES.CONSOLIDATION, TASK_TYPES.DISPUTE, TASK_TYPES.RESOLVE_DISPUTE];
      /* This function returns the parent task of of Consolidate, Dispute, or Resolve Task.
         Parent means the task (Edit,Comment,Grade,or Critique) that it belongs to*/
        let possibleParents = root.first(function(node){
            return node.model.id == taskIndex;
        }).getPath();
        possibleParents = possibleParents.reverse();
        possibleParents.shift();
        let parentID = null;

        for(let i = 0; i < possibleParents.length;i++){
            let currNode = possibleParents[i];
            let nodeIsExcluded = excludedTasks.includes(workflowData[currNode.model.id].TA_type);
            if(!nodeIsExcluded){
                parentID = currNode.model.id;
                break;
            }
        }
        excludedTasks = null;
        possibleParents = null;
        return parentID;
    }

    addLinkedTaskFields(root, workflowData,taskIndex){
      /* Adds the linked task's fields object to the current task's fields
         Usually, the current task will have no fields, but it is done by adding in
         case future support for adding more fields on top of linked fields is desired*/

        let linkedIndex = this.getParentID(root, workflowData, taskIndex);
        let linkedFields = workflowData[linkedIndex].TA_fields;
        let oldNumberOfFields = workflowData[taskIndex].TA_fields.number_of_fields;
        let oldFieldTitles = workflowData[taskIndex].TA_fields.field_titles;
        for(let i = 0; i < linkedFields.number_of_fields; i++){
            workflowData[taskIndex].TA_fields[i + oldNumberOfFields] = linkedFields[i];
        }

        workflowData[taskIndex].TA_fields.number_of_fields = oldNumberOfFields + linkedFields.number_of_fields;
        workflowData[taskIndex].TA_fields.field_titles = [...oldFieldTitles, ...linkedFields.field_titles];

        return workflowData;
    }

    addFieldButton(taskIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let field = newData[workflowIndex].Workflow[taskIndex].TA_fields[newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields];
        newData[workflowIndex].Workflow[taskIndex].TA_fields[newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields] = cloneDeep(this.defaultFields);
        let titleString = newData[workflowIndex].Workflow[taskIndex].TA_fields[newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields].title + (' ' + (newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields + 1));
        newData[workflowIndex].Workflow[taskIndex].TA_fields[newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields].title = titleString;
        newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields += 1;
        newData[workflowIndex].Workflow[taskIndex].TA_fields.field_titles.push(titleString);

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    removeFieldButton(taskIndex, workflowIndex, fieldIndex){
        let newData = this.state.WorkflowDetails;
        delete newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex];
        newData[workflowIndex].Workflow[taskIndex].TA_fields.field_titles.splice(fieldIndex, 1);
        newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields -= 1;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});

    }

    dropTask(taskClass, taskIndex, workflowIndex){
        let newData = this.state.WorkflowDetails;
        switch (taskClass) {
        case 'reflect':
            newData = this.removeTask(newData, this.REFLECT_IDX, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[taskIndex].TA_allow_reflection[0] = 'none';
            newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[0] = false;
            break;
        case 'assess':
            newData = this.removeTask(newData, this.ASSESS_IDX, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[taskIndex].TA_allow_assessment = 'none';
            newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[1] = false;
            break;
        case 'dispute':
            break;
        case 'consolidate':
            break;
        case 'create':
            newData = this.removeTask(newData, this.CREATE_IDX, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[taskIndex].TA_leads_to_new_problem = false;
            break;
        case 'solve':
            newData = this.removeTask(newData, this.SOLVE_IDX, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[taskIndex].TA_leads_to_new_solution = false;
            break;
        default:

        }

        newData = this.removeGradeDist(newData, workflowIndex);

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeDataCheck(stateField, taskIndex, workflowIndex, firstIndex) {
        let newData = this.state.WorkflowDetails;

        switch (stateField) {
        case 'TA_allow_reflection':
            {
                if (newData[workflowIndex].Workflow[taskIndex][stateField][0] != 'none') {

                    let taskChildrenNodes = this.taskChildren(this.getReflectIndex(taskIndex, workflowIndex), workflowIndex);

                    if(taskChildrenNodes.length ==0){
                        this.dropTask('reflect', taskIndex, workflowIndex);
                    } else {
                        let messageDiv = `The following tasks will be dropped:
                                <br />
                                <ul>
                                ${taskChildrenNodes.map((task)=>{
                                    return (`<li>${task}</li>`);
                                }).reduce((val, acc) => {
                                    return acc + val;
                                }, '')}
                            </ul>
                            <br />
                            Are you sure you want to continue?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: 'OK',
                            cancelLabel: 'Cancel',
                            title: 'Dropping Multiple Tasks'
                        }).then(()=>{
                            this.dropTask('reflect', taskIndex, workflowIndex);
                        }, () => {
                        });
                    }

                } else {
                    newData[workflowIndex].Workflow[taskIndex][stateField][0] = 'edit';
                    newData = this.addTask(newData, this.REFLECT_IDX, taskIndex, workflowIndex);
                }
            }
            break;

        case 'TA_allow_assessment':
            {
                if (newData[workflowIndex].Workflow[taskIndex][stateField] != 'none') {
                    let taskChildrenNodes = this.taskChildren(this.getAssessIndex(taskIndex, workflowIndex), workflowIndex);
                    if(taskChildrenNodes.length == 0){
                        this.dropTask('assess', taskIndex, workflowIndex);
                    } else {
                        let messageDiv = `The following tasks will be dropped:
                                <br />
                                <ul>
                                ${taskChildrenNodes.map((task)=>{
                                    return (`<li>${task}</li>`);
                                }).reduce((val, acc) => {
                                    return acc + val;
                                }, '')}
                                </ul>
                                <br />
                                Are you sure you want to continue?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: 'OK',
                            cancelLabel: 'Cancel',
                            title: 'Dropping Multiple Tasks'
                        }).then(()=>{
                            this.dropTask('assess', taskIndex, workflowIndex);
                        }, () => {
                        });
                    }
                } else {
                    newData = this.addTask(newData, this.ASSESS_IDX, taskIndex, workflowIndex);
                    newData = this.addGradeDist(newData, workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex][stateField] = 'grade';
                }
            }
            break;
        case 'TA_leads_to_new_problem':
            {
                if (newData[workflowIndex].Workflow[taskIndex][stateField]) {
                    let taskChildrenNodes = this.taskChildren(this.getCreateIndex(taskIndex, workflowIndex), workflowIndex);

                    if(taskChildrenNodes.length ==0){
                        this.dropTask('create', taskIndex, workflowIndex);
                    } else {
                        let messageDiv = `The following tasks will be dropped:
                                <br />
                                <ul>
                                ${taskChildrenNodes.map((task)=>{
                                    return (`<li>${task}</li>`);
                                }).reduce((val, acc) => {
                                    return acc + val;
                                }, '')}
                            </ul>
                            <br />
                            Are you sure you want to continue?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: 'OK',
                            cancelLabel: 'Cancel',
                            title: 'Dropping Multiple Tasks'
                        }).then(()=>{
                            this.dropTask('create', taskIndex, workflowIndex);
                        }, () => {
                        });
                    }
                } else {
                    newData = this.addTask(newData, this.CREATE_IDX, taskIndex, workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex][stateField] = true;
                }
            }
            break;
        case 'TA_leads_to_new_solution':
            {'';
                if (newData[workflowIndex].Workflow[taskIndex][stateField]) {
                    let taskChildrenNodes = this.taskChildren(this.getSolveIndex(taskIndex, workflowIndex), workflowIndex);
                    if(taskChildrenNodes.length == 0){
                        this.dropTask('solve', taskIndex, workflowIndex);
                    } else {
                        let messageDiv = `The following tasks will be dropped:
                                <br />
                                <ul>
                                ${taskChildrenNodes.map((task)=>{
                                    return (`<li>${task}</li>`);
                                }).reduce((val, acc) => {
                                    return acc + val;
                                }, '')}
                                </ul>
                                <br />
                                Are you sure you want to continue?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: 'OK',
                            cancelLabel: 'Cancel',
                            title: 'Dropping Multiple Tasks'
                        }).then(()=>{
                            this.dropTask('solve', taskIndex, workflowIndex);
                        }, () => {
                        });
                    }
                } else {
                    newData = this.addTask(newData, this.SOLVE_IDX, taskIndex, workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex][stateField] = true;
                }
            }
            break;

        case 'Reflect_Consolidate':
            {
                if (newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[0]) {
                    this.removeConsolidation(this.getReflectIndex(taskIndex, workflowIndex), workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[0] = false;
                } else {
                    this.addConsolidation(this.getReflectIndex(taskIndex, workflowIndex), workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[0] = true;
                }
            }
            break;

        case 'Reflect_Dispute':
            {
                let reflectIndex = this.getReflectIndex(taskIndex, workflowIndex);
                if (newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute) {
                    newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = false;
                    this.removeDispute(reflectIndex, workflowIndex);
                } else {
                    newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = true;
                    this.addDispute(reflectIndex, workflowIndex);
                }

            }
            break;

        case 'Assess_Consolidate':
            {
                if (newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[1]) {
                    this.removeConsolidation(this.getAssessIndex(taskIndex, workflowIndex), workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[1] = false;
                } else {
                    this.addConsolidation(this.getAssessIndex(taskIndex, workflowIndex), workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex].AllowConsolidations[1] = true;
                }
            }
            break;

        case 'Assess_Dispute':
            {
                let assessIndex = this.getAssessIndex(taskIndex, workflowIndex);
                if (newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute) {
                    newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = false;
                    this.removeDispute(assessIndex, workflowIndex);

                } else {
                    newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = true;
                    this.addDispute(assessIndex, workflowIndex);
                }
            }
            break;

        case 'TA_assignee_constraints':
            {
                if (newData[workflowIndex].Workflow[taskIndex][stateField][1] != 'group') {
                    newData[workflowIndex].Workflow[taskIndex][stateField][1] = 'group';
                } else {
                    newData[workflowIndex].Workflow[taskIndex][stateField][1] = 'individual';
                }
            }
            break;

        default:
            newData[workflowIndex].Workflow[taskIndex][stateField] = this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex][stateField]
                    ? false
                    : true;
            break;
        }

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeDropdownData(stateField, taskIndex, workflowIndex, e) {
        let newData = this.state.WorkflowDetails;
        switch (stateField) {
        case 'TA_allow_reflection':
            {
                newData[workflowIndex].Workflow[taskIndex][stateField][0] = e.value;
                this.changeReflection(taskIndex, workflowIndex, e.value);
            }
            break;
        case 'TA_allow_assessment':
            {
                newData[workflowIndex].Workflow[taskIndex][stateField] = e.value;
                this.changeAssessment(taskIndex, workflowIndex, e.value);
            }
            break;
        case 'TA_assignee_constraints':
            newData[workflowIndex].Workflow[taskIndex][stateField][0] = e.value;
            break;
        case 'TA_function_type_Assess':
            {
                let targetIndex = this.getConsolidationIndex(false, taskIndex, workflowIndex);
                newData[workflowIndex].Workflow[targetIndex]['TA_function_type'] = e.value;
            }
            break;
        case 'TA_function_type_Reflect':
            {
                let targetIndex = this.getConsolidationIndex(true, taskIndex, workflowIndex);
                newData[workflowIndex].Workflow[targetIndex]['TA_function_type'] = e.value;
            }
            break;
        default:
            newData[workflowIndex].Workflow[taskIndex][stateField] = e.value;
            break;
        }

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeAssigneeInChild(reflect, taskIndex, workflowIndex, e) { //special setter function that changes the assignee constraints of the child Reflect/Assess node
        //if called by a Reflection node, reflect will be true, if Assessment node, reflect is false
        let newData = this.state.WorkflowDetails;
        //need to go into tree here and get taskIndex
        let target = reflect
            ? this.getReflectIndex(taskIndex, workflowIndex)
            : this.getAssessIndex(taskIndex, workflowIndex); // taskIndex of child (reflect/assess) node
        newData[workflowIndex].Workflow[target]['TA_assignee_constraints'][0] = e.value;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    getAssigneeInChild(reflect, taskIndex, workflowIndex) {
        let targetIndex = (reflect ? this.getReflectIndex(taskIndex, workflowIndex) : this.getAssessIndex(taskIndex, workflowIndex));
        return this.state.WorkflowDetails[workflowIndex].Workflow[targetIndex]['TA_assignee_constraints'][0];
    }

    cleanAssigneeConstraints(stateData, deleteTaskIndex, workflowIndex) {
        //will need to go through list of workflows, go to TA_assignee_constraints[2], go through ALL constraints keys, check if taskIndex is in the array, if it is, pop it

        stateData[workflowIndex].Workflow.forEach(function(task) {
            if (Object.keys(task).length > 0) {
                Object.keys(task.TA_assignee_constraints[2]).forEach(function(key) {
                    let inArray = task.TA_assignee_constraints[2][key].indexOf(deleteTaskIndex);
                    if (inArray > -1) {
                        task.TA_assignee_constraints[2][key].splice(inArray, 1);
                    }
                });
            }
        });

        return stateData;

    }

    checkAssigneeConstraints(taskIndex, constraint, workflowIndex) {
        let newData = this.state.WorkflowDetails;

        if (constraint === 'none') {
            newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2] = {};
            this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
            return;
        }

        if (newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint] === undefined) {
            newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint] = [];
        } else {
            delete newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint];
        }

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }


    checkAssigneeConstraintTasks(taskIndex, constraint, referId, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        if (newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint] == undefined) {
            newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint] = [];
        }

        let indexInArray = newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint].indexOf(referId);

        if (indexInArray > -1) {
            newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint].splice(indexInArray, 1);
        } else if (constraint == 'same_as') {
            newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint] = [referId];
        } else {
            newData[workflowIndex].Workflow[taskIndex].TA_assignee_constraints[2][constraint].push(referId);
        }
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeDropdownFieldData(stateField, taskIndex, field, workflowIndex, e) {
        let newData = this.state.WorkflowDetails;
        if(stateField == 'assessment_type') {
            switch(e.value){
            case 'grade':
            case 'rating':
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].default_content[0] = 0;
                break;
            case 'pass':
            case 'evalutation':
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].default_content[0] = '';
                break;
            default:
                break;
            }
        } else if( stateField == 'fieldType'){
            switch(e.value){
            case 'text':
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].default_content[0] = '';
                break;
            case 'numeric':
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].default_content[0] = 0;
                break;
            default:
                break;
            }
        }
        newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField] = e.value;


        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeFieldName(taskIndex, field, workflowIndex, e) {
        e.preventDefault();
        if (e.target.value > 1000) {
            return;
        }
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex].TA_fields[field].title = e.target.value;
        newData[workflowIndex].Workflow[taskIndex].TA_fields.field_titles[field] = e.target.value;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeFieldCheck(stateField, taskIndex, field, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField] = !this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField];

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeFileUpload(type, taskIndex, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex].TA_file_upload[type] = val;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeInputData(stateField, taskIndex, workflowIndex, e) {
        e.preventDefault();

        if (e.target.value.length > 45000) {
            return;
        }
        if (stateField == 'TA_display_name') {
            if (e.target.value.length > 254) {
                return;
            }
        }
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex][stateField] = e.target.value;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeInputFieldData(stateField, taskIndex, field, workflowIndex, e) {
        e.preventDefault();

        if (e.target.value.length > 45000) {
            return;
        }
        let newData = this.state.WorkflowDetails;
        if (stateField == 'default_content') {
            newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField][0] = e.target.value;
        } else {
            newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField] = e.target.value;
        }
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeNumericData(stateField, taskIndex, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;

        switch (stateField) {
        case 'TA_due_type':
            newData[workflowIndex].Workflow[taskIndex][stateField][1] = value * 1440;
            break;
        case 'TA_trigger_consolidation_threshold_reflect':
                //let targetIndex1 = this.getReflectIndex(taskIndex, workflowIndex);
            let targetIndex1 = this.getConsolidationIndex(true, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[targetIndex1]['TA_trigger_consolidation_threshold'][0] = value;
            break;
        case 'TA_trigger_consolidation_threshold_assess':
                //let targetIndex2 = this.getAssessIndex(taskIndex, workflowIndex);
            let targetIndex2 = this.getConsolidationIndex(false, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[targetIndex2]['TA_trigger_consolidation_threshold'][0] = value;
            break;
        default:
            newData[workflowIndex].Workflow[taskIndex][stateField] = value;
            break;
        }
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    getTriggerConsolidationThreshold(taskIndex, workflowIndex, isReflect){
        let targetIndex = this.getConsolidationIndex(isReflect, taskIndex, workflowIndex);
        return this.state.WorkflowDetails[workflowIndex].Workflow[targetIndex]['TA_trigger_consolidation_threshold'][0];
    }


    changeNumericFieldData(stateField, taskIndex, field, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField] = value;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeRadioData(stateField, taskIndex, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        switch (stateField) {
        case 'TA_due_type':
            newData[workflowIndex].Workflow[taskIndex][stateField][0] = val;
            break;
        case 'TA_one_or_separate':
            if(val === true){
                newData[workflowIndex].Workflow[taskIndex].SeeSameActivity = false;
            } else{
                newData[workflowIndex].Workflow[taskIndex].SeeSameActivity = true;
            }
            newData[workflowIndex].Workflow[taskIndex][stateField] = val;

            break;
        case 'TA_trigger_consolidation_threshold_reflect':
            let targetIndex1 = this.getConsolidationIndex(true, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[targetIndex1].TA_trigger_consolidation_threshold[1] = val;
            break;
        case 'TA_trigger_consolidation_threshold_assess':
            let targetIndex2 = this.getConsolidationIndex(false, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[targetIndex2]['TA_trigger_consolidation_threshold'][1] = val;
            break;
        case 'StartDelay':
            {
                newData[workflowIndex].Workflow[taskIndex][stateField] = val;
                newData[workflowIndex].Workflow[taskIndex]['TA_start_delay'] = (val
                        ? 1
                        : 0);
            }
        default:
            newData[workflowIndex].Workflow[taskIndex][stateField] = val;
            break;

        }
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeSimpleGradeCheck(taskIndex, workflowIndex) {
        let newData = this.state.WorkflowDetails;
        let temp = null;
        if (this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex].TA_simple_grade == 'none') {
            temp = 'exists';
        } else {
            temp = 'none';
        }

        newData[workflowIndex].Workflow[taskIndex].TA_simple_grade = temp;
        newData[workflowIndex].Workflow[taskIndex].SimpleGradePointReduction = 0;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeTASimpleGradeCheck(taskIndex, workflowIndex) {

        let newData = this.state.WorkflowDetails;
        if (newData[workflowIndex].Workflow[taskIndex].TA_simple_grade != 'off_per_day(100)') {
            newData[workflowIndex].Workflow[taskIndex].TA_simple_grade = 'off_per_day(100)';
            newData[workflowIndex].Workflow[taskIndex].SimpleGradePointReduction = 100;
        } else {
            newData[workflowIndex].Workflow[taskIndex].TA_simple_grade = 'off_per_day(5)';
            newData[workflowIndex].Workflow[taskIndex].SimpleGradePointReduction = 5;
        }

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeTASimpleGradePoints(taskIndex, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        if (val == 0) {
            newData[workflowIndex].Workflow[taskIndex].TA_simple_grade = 'exists';

        } else {
            newData[workflowIndex].Workflow[taskIndex].TA_simple_grade = 'off_per_day(' + val + ')';

        }

        newData[workflowIndex].Workflow[taskIndex].SimpleGradePointReduction = val;

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});

    }

    getAlreadyCreatedTasks(currTaskIndex, workflowIndex) { //change to get from tree

        let tasksPath = new Array();
        this.state.WorkflowDetails[workflowIndex].WorkflowStructure.walk(function(node) {

            if (node.model.id == currTaskIndex) {
                return false;
            }
            if (node.model.id != -1) {
                if (this.state.WorkflowDetails[workflowIndex].Workflow[node.model.id].TA_type !== TASK_TYPES.NEEDS_CONSOLIDATION) {
                    tasksPath.push({
                        value: node.model.id,
                        label: this.state.WorkflowDetails[workflowIndex].Workflow[node.model.id].TA_display_name
                    });

                }
            }

        }, this);

        return tasksPath;
    }

    getTaskFields(currTaskIndex, workflowIndex) {
        if (currTaskIndex == null) {
            return [];
        }
        let fieldList = this.state.WorkflowDetails[workflowIndex].Workflow[currTaskIndex].TA_fields.field_titles.map(function(title, taskIndex) {
            return {value: taskIndex, label: title};
        });

        return fieldList;
    }

    setDefaultField(defIndex, fieldIndex, taskIndex, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to[defIndex] = val;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});

    }

    getConsolidateValue(taskIndex, workflowIndex, isAssess) {
        let targetIndex = null;
        targetIndex = this.getConsolidationIndex(!isAssess, taskIndex, workflowIndex);

        if (targetIndex !== null) {
            return this.state.WorkflowDetails[workflowIndex].Workflow[targetIndex].TA_function_type;
        } else {
            return null;
        }
    }

    //-----------------------------------------------------------------------------

    //////////////////   Assignment Details Functions  //////////////////////////////////

    changeAssignmentInput(fieldName, event) {
        let newData = this.state.AssignmentActivityData;
        if (event.target.value.length > 45000) {
            return;
        }
        if (fieldName == 'AA_name') {
            if (event.target.value.length > 254) {
                return;
            }
            newData.AA_display_name = event.target.value;
        }

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
                newData[fieldName] = value;
                this.setState({AssignmentActivityData: newData});
            }
            else if (difference < 0) {
                while (difference < 0) {
                    newWorkflowData.push(cloneDeep(this.blankWorkflow));
                    difference += 1;
                }
                newData[fieldName] = value;
                this.setState({AssignmentActivityData: newData});
                this.makeDefaultWorkflowStructure(newWorkflowData.length-1);
            }
        }
    }

    ////////////////    Workflow (Problem) Details functions    ////////////////////

    addGradeDist(stateData, workflowIndex) {
        stateData[workflowIndex].WA_grade_distribution[stateData[workflowIndex].Workflow.length - 1] = 0;
        let distKeys = Object.keys(stateData[workflowIndex].WA_grade_distribution);
        let count = distKeys.length;

        distKeys.forEach(function(task) {
            stateData[workflowIndex].WA_grade_distribution[task] = Math.floor(100 / count);
        });

        stateData[workflowIndex].WA_grade_distribution[distKeys[count - 1]] = Math.floor(100 / count) + (100 % count);
        stateData[workflowIndex].NumberOfGradingTask += 1;

        distKeys = null;
        count = null;

        return stateData;

    }

    removeGradeDist(stateData, workflowIndex) {
        let gradedTasks = this.getFinalGradeTasksArray(workflowIndex);
        let count = gradedTasks.length;
        let newGradeDist = new Object();
        if(count == 0){
            return stateData;
        }
        if (count != stateData[workflowIndex].NumberOfGradingTask) {
            gradedTasks.forEach(function(task) {
                newGradeDist[task] = Math.floor(100 / count);
            });

            newGradeDist[gradedTasks[count - 1]] = Math.floor(100 / count) + (100 % count);

            stateData[workflowIndex].WA_grade_distribution = newGradeDist;
            stateData[workflowIndex].NumberOfGradingTask = count;

            gradedTasks = null;
            count = null;
        }

        return stateData;
    }

    handleSelect(value) { //need this for the tabs that appear on multiple workflows
        this.setState({CurrentWorkflowIndex: value});
    }

    changeWorkflowData(stateField, workflowIndex, value) {
        let newWorkflowDetails = this.state.WorkflowDetails;
        newWorkflowDetails[workflowIndex][stateField] = value;
        this.setState({WorkflowDetails: newWorkflowDetails});
    } //this handles changing any NumberField data values

    changeWorkflowGradeDist(workflowIndex, taskIndex, numberFieldIndex, value) {
        let newWorkflowDetails = this.state.WorkflowDetails;
        //let newGradeDist = this.state.WorkflowDetails[workflowIndex].WA_grade_distribution;
        newWorkflowDetails[workflowIndex].WA_grade_distribution[taskIndex] = value;
        newWorkflowDetails = this.checkWorkflowGradeDist(workflowIndex, newWorkflowDetails, taskIndex, value);
        this.setState({WorkflowDetails: newWorkflowDetails});
    } // this is special for the grade distribution object

    checkWorkflowGradeDist(workflowIndex, stateData, taskChangedIndex, value) {
        let distKeys = Object.keys(stateData[workflowIndex].WA_grade_distribution);
        let sum = Object.values(stateData[workflowIndex].WA_grade_distribution).reduce((a, b) => a + b, 0);
        let numOfFields = distKeys.length;
        let start = distKeys.indexOf(taskChangedIndex);
        if(sum < 100){
            let underflow = 100-sum;
            stateData[workflowIndex].WA_grade_distribution[distKeys[(start +1) % numOfFields]] += underflow;
        }
        else if(sum > 100){
            sum -= 100;
            let i = (start + 1) % numOfFields;
            while(sum > 0){
                if(sum <= stateData[workflowIndex].WA_grade_distribution[distKeys[i]]){
                    stateData[workflowIndex].WA_grade_distribution[distKeys[i]] -= sum;
                    sum = 0;
                }
                else{
                    sum -= stateData[workflowIndex].WA_grade_distribution[distKeys[i]];
                    stateData[workflowIndex].WA_grade_distribution[distKeys[i]] = 0;
                }
                i = (i+1)%numOfFields;
            }
        }
        return stateData;
    }

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

    getFinalGradeTasksArray(workflowIndex) { //gets a list of all the tasks that will be accounted for in grading distribution
        let newArray = new Array();
        let assessmentTypes = [TASK_TYPES.GRADE_PROBLEM];
        this.state.WorkflowDetails[workflowIndex].Workflow.forEach(function(task, index) {
            if (Object.keys(task).length > 0) {
                if (indexOf(assessmentTypes, task.TA_type) != -1 || task.TA_simple_grade != 'none') {
                    newArray.push(index);
                }
            }
        });

        if (newArray.length <= 0) {
            return [];
        }
        return newArray;
    }

    ///---------------------------------------------------------------------------

    changeSelectedTask(val){ //if ever want to implement single task-based view
        this.setState({SelectedTask: val});
    }

    callTaskFunction(){
        console.log(arguments);
        const args = [].slice.call(arguments);
        const functionName = args.shift();
        return this[functionName](...args);
    }

    aFunction(a, b ,d,ra,j,r){
        console.log(a, b ,d, ra,j,r);
        this.setState({
            Garbage: a
        });
    }

    render() {
        let infoMessage = null;
        let submitButtonView = (
          <button  type="button" onClick={this.onSubmit.bind(this)}>
              <i className="fa fa-check"></i>{this.state.Strings.Submit}
          </button>
        );
        let saveButtonView = (<button onClick={this.onSave.bind(this)}>Save</button>);

        if(this.state.SaveSuccess){
            infoMessage = (
              <span onClick={() => {
                  this.setState({SubmitSuccess: false});
              }} className="small-info-message">
              <span className="success-message">
                {this.state.Strings.SaveSuccessMessage}
              </span>
              </span>
          );
        }

        if (this.state.SubmitSuccess) {
            infoMessage = (
                <span onClick={() => {
                    this.setState({SubmitSuccess: false});
                }} className="small-info-message">
                <span className="success-message">
                  {this.state.Strings.SubmitSuccessMessage}
                </span>
                </span>
            );

        }
        if (this.state.SubmitError && !this.state.SubmitSuccess) {
            infoMessage = (
                <span onClick={() => {
                    this.setState({SubmitError: false});
                }} className="small-info-message">
                <div className="error-message">{this.state.Strings.ErrorMessage}</div>
                </span>
            );
        }

        if (!this.state.Loaded) {
            return (
                <div>
                    <div className="placeholder"></div>
                    <i style={{
                        marginLeft: '45vw'
                    }} className="fa fa-cog fa-spin fa-4x fa-fw"></i>
                    <span className="sr-only"></span>
                </div>
            );
        } else {
            let tabListAr = [];
            let tabPanelAr = [];
            let workflowsView = null;

            if (!this.state.SubmitButtonShow || !this.props.UserID) {
                submitButtonView = null;
                saveButtonView = null;
            }

            this.state.WorkflowDetails.forEach(function(workflow, index) {

                let tV = new Array();
                workflow.WorkflowStructure.walk({strategy: 'pre'}, function(node) {
                    if (node.model.id != -1) {
                        let task = workflow.Workflow[node.model.id];
                        if (task.TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || task.TA_type == TASK_TYPES.COMPLETED) {
                            return null;
                        }
                        if (Object.keys(task).length !== 0) {
                            tV.push(<TaskDetailsComponent key={index + '-' + node.model.id}
                            index={node.model.id}
                            workflowIndex={index}
                            LastTaskChanged={this.state.LastTaskChanged}
                            TaskActivityData={task}
                            isOpen={this.state.SelectedTask == node.model.id}
                            Strings={this.state.Strings}
                            addFieldButton={this.addFieldButton.bind(this)}
                            removeFieldButton={this.removeFieldButton.bind(this)}
                            getReflectNumberofParticipants={this.getReflectNumberofParticipants.bind(this)}
                            getAssessNumberofParticipants={this.getAssessNumberofParticipants.bind(this)}
                            checkAssigneeConstraints={this.checkAssigneeConstraints.bind(this)}
                            checkAssigneeConstraintTasks={this.checkAssigneeConstraintTasks.bind(this)}
                            getAlreadyCreatedTasks={this.getAlreadyCreatedTasks.bind(this)}
                            getAssigneeInChild={this.getAssigneeInChild.bind(this)}
                            getTaskFields={this.getTaskFields.bind(this)}
                            setDefaultField={this.setDefaultField.bind(this)}
                            getConsolidateValue={this.getConsolidateValue.bind(this)}
                            getTriggerConsolidationThreshold={this.getTriggerConsolidationThreshold.bind(this)}
                            changeSelectedTask={this.changeSelectedTask.bind(this)}
                            canConsolidate={this.canConsolidate.bind(this)}
                            canDispute={this.canDispute.bind(this)}
                            callTaskFunction={this.callTaskFunction.bind(this)}
                          /> );
                        }
                    }
                }, this);
                tabListAr.push(
                    <Tab key={'tab stub ' + index}>{workflow.WA_name}</Tab>
                );
                tabPanelAr.push(
                    <TabPanel key={'tab ' + index}>
                            <ProblemDetailsComponent key={'Workflows' + index} workflowIndex={index}
                              WorkflowDetails={workflow}
                              NumberofWorkflows={this.state.AssignmentActivityData.NumberofWorkflows}
                              changeWorkflowData={this.changeWorkflowData.bind(this)}
                              changeWorkflowInputData={this.changeWorkflowInputData.bind(this)}
                              changeWorkflowDropdownData={this.changeWorkflowDropdownData.bind(this)}
                              changeWorkflowGradeDist={this.changeWorkflowGradeDist.bind(this)}
                              Strings={this.state.Strings}
                              />
                            <br/>
                            <br/>
                            {tV}
                    </TabPanel>
                );
            }, this);

            workflowsView = (
                <Tabs onSelect={this.handleSelect.bind(this)} selectedIndex={this.state.CurrentWorkflowIndex}>
                    <TabList className="big-text">
                        {tabListAr}
                    </TabList>
                    {tabPanelAr}
                </Tabs>
            );

            return (
                <div className="editor-container">
                  {infoMessage}
                  <div>
                    <AssignmentDetailsComponent AssignmentActivityData={this.state.AssignmentActivityData}
                      Courses={this.state.Courses} Semesters={this.state.Semesters}
                      changeAssignmentNumeric={this.changeAssignmentNumeric.bind(this)}
                      changeAssignmentInput={this.changeAssignmentInput.bind(this)}
                      changeAssignmentDropdown={this.changeAssignmentDropdown.bind(this)}
                      Strings={this.state.Strings}
                    />
                    <br/> {workflowsView}
                    <br/>
                    <div className="section-button-area">
                      {submitButtonView}
                      {saveButtonView}
                    </div>


                  </div>
                </div>
            );
        }
    }
}

export default AssignmentEditorContainer;
