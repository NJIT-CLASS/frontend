//The main component of the assignment editor. This calls the other components and passes in the methods defined here. The data is all made here and
// will be submitted from this component. This component has no views, it only contains data and components.
//
// TODO
// add TA_minimum_duration: Add number of minutes that a task must last if they start it late
// Assignee constraint second level of checkboxes needs isClicked prop set
import React from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {cloneDeep, clone, isEmpty, indexOf} from 'lodash';

var TreeModel = require('tree-model'); /// references: http://jnuno.com/tree-model-js/  https://github.com/joaonuno/tree-model-js
let FlatToNested = require('flat-to-nested');

import apiCall from '../shared/apiCall';
import TaskDetailsComponent from './taskDetails';
import AssignmentDetailsComponent from './assignmentDetails';
import ProblemDetailsComponent from './problemDetails';
import confirmModal from './confirmModal';
import HeaderComponent from './headerComponent';
import {TASK_TYPES, TASK_TYPES_TEXT} from '../../server/utils/react_constants';
import Strings from './assignmentEditorStrings';

class AssignmentEditorContainer extends React.Component {
    constructor(props) {
        super(props);
        /*
        Props:
            - UserID
            - CourseID
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

        this.state = {
            CurrentWorkflowIndex: 0,
            LastTaskChanged: 0,
            SelectedTask:0,
            SubmitSuccess: false,
            ResumingFromSaved: false,
            SubmitButtonShow: true,
            SaveSuccess: false,
            SubmitError: false,
            InfoMessage: '',
            InfoMessageType: '', //success || error
            Loaded: false,
            Courses: null,
            Semesters: null,
            CourseSelected: {
                Name: '',
                Number: ''
            },
            PartialAssignmentID: this.props.PartialAssignmentID != '' ? this.props.PartialAssignmentID : null,
            Strings: Strings
        };
    }

    makeTaskParameterTemplates(){
        const strings = this.state.Strings;
        this.defaultFields = {
            title: strings.Field,
            show_title: false,
            assessment_type: null,
            numeric_min: 0,
            numeric_max: 40,
            rating_max: 5,
            list_of_labels: [strings.Easy,strings.Medium, strings.Difficult],
            field_type: 'text',
            requires_justification: false,
            revise_and_resubmit: '',
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
                TA_fields: {
                    number_of_fields: 0,
                    field_titles: [],
                    field_distribution: {},
                    
                },
                SimpleGradePointReduction: 0,
                StartDelay: false,
                CustomNameSet: false,
                TA_file_upload: {'mandatory': 0, 'optional': 0},
                AllowFileUpload: false,
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
                AllowConsolidation: false,
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
            TA_display_name: strings.CreateProblemName,
            TA_type: TASK_TYPES.CREATE_PROBLEM,
            TA_name: TASK_TYPES_TEXT.CREATE_PROBLEM,
            VersionEvaluation: 'last',
            TA_what_if_late: 'keep_same_participant',
            TA_one_or_separate: false,
            TA_assignee_constraints: [
                'student', 'individual', {}
            ],
            TA_overall_instructions: strings.CreateOverallInstructions,
            TA_number_participant: 1,
            // TA_allow_reflection: [
            //     'edit', 'wait'
            // ],
            TA_function_type: 'max',
            TA_fields: {
                number_of_fields: 1,
                field_titles: [strings.CreateDefaultFieldTitle],
                field_distribution: {},
                0: {
                    title: strings.CreateDefaultFieldTitle,
                    show_title: false,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: [strings.Easy,strings.Medium,strings.Difficult],
                    field_type: 'text',
                    requires_justification: false,
                    revise_and_resubmit: '',
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
            TA_display_name: strings.EditProblemName,
            TA_type: TASK_TYPES.EDIT,
            TA_name: TASK_TYPES_TEXT.EDIT,
            TA_overall_instructions: strings.EditOverallInstructions,
            VersionEvaluation: 'whole',
            TA_assignee_constraints: [
                'instructor',
                'individual', {
                    'not_in_workflow_instance': []
                }
            ],
            TA_fields: {
                number_of_fields: 1,
                field_titles: [strings.EditFieldTitle],
                field_distribution: {},
                0: {
                    title: strings.EditFieldTitle,
                    show_title: true,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: [strings.Easy,strings.Medium,strings.Difficult],
                    field_type: 'text',
                    requires_justification: false,
                    revise_and_resubmit: '',
                    instructions: strings.EditFieldInstructions,
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
            TA_display_name: strings.CommentName,
            TA_type: TASK_TYPES.COMMENT,
            TA_name: TASK_TYPES_TEXT.COMMENT,
            TA_overall_instructions: strings.CommentOverallInstructions,
            VersionEvaluation: 'whole',
            TA_assignee_constraints: [
                'student',
                'individual', {
                    'not_in_workflow_instance': []
                }
            ],
            TA_allow_reflection: [
                'none', 'don\'t wait'
            ],
            TA_fields: {
                number_of_fields: 1,
                field_titles: [strings.Field],
                field_distribution: {},
                0: cloneDeep(this.defaultFields)
            }
        });

        this.solveProblemTask = createTaskObject({
            TA_display_name: strings.SolveProblemName,
            TA_type: TASK_TYPES.SOLVE_PROBLEM,
            TA_name:  TASK_TYPES_TEXT.SOLVE_PROBLEM,
            TA_overall_instructions: strings.SolveOverallInstructions,
            VersionEvaluation: 'last',
            TA_assignee_constraints: ['student',
                'individual', {}
            ],
            TA_fields: {
                number_of_fields: 1,
                field_distribution: {},
                field_titles: [strings.SolveDefaultFieldTitle],
                0: {
                    title: strings.SolveDefaultFieldTitle,
                    show_title: false,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: [strings.Easy,strings.Medium,strings.Difficult],
                    field_type: 'text',
                    requires_justification: false,
                    revise_and_resubmit: '',
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
            TA_display_name: strings.GradeName,
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
                field_titles: [strings.GradeCorrectnessTitle,strings.GradeCompletenessTitle],
                field_distribution: {
                    0: 50,
                    1: 50
                },
                0: {
                    title: strings.GradeCorrectnessTitle,
                    show_title: true,
                    assessment_type: 'grade',
                    numeric_min: 0,
                    numeric_max: 50,
                    rating_max: 5,
                    list_of_labels: [strings.Easy,strings.Medium,strings.Difficult],
                    field_type: 'assessment',
                    requires_justification: true,
                    revise_and_resubmit: '',
                    instructions: strings.GradeCorrectnessInstructions,
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [
                        null, null
                    ],
                    default_content: ['', '']
                },
                1: {
                    title: strings.GradeCompletenessTitle,
                    show_title: true,
                    assessment_type: 'grade',
                    numeric_min: 0,
                    numeric_max: 50,
                    rating_max: 5,
                    list_of_labels: [strings.Easy,strings.Medium,strings.Difficult],
                    field_type: 'assessment',
                    requires_justification: true,
                    revise_and_resubmit: '',
                    instructions: strings.GradeCompletenessInstructions,
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
            TA_display_name: strings.CritiqueName,
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
                field_titles: [strings.CritiqueFieldTitle],
                field_distribution: { 0: 100},
                0: {
                    title: strings.CritiqueFieldTitle,
                    show_title: false,
                    assessment_type: 'grade',
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: [strings.Easy,strings.Medium,strings.Difficult],
                    field_type: 'assessment',
                    requires_justification: false,
                    revise_and_resubmit: '',
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
            TA_display_name: strings.NeedsConsolidationName,
            TA_type: TASK_TYPES.NEEDS_CONSOLIDATION,
            TA_documentation:'',
            TA_name: TASK_TYPES_TEXT.NEEDS_CONSOLIDATION,
            TA_number_participant: 1,
            TA_assignee_constraints: [
                'student',
                'individual',
                {}
            ],
            TA_trigger_consolidation_threshold: [15,'percent'],
            TA_fields: null
        });

        this.consolidationTask = createTaskObject({
            TA_display_name: strings.ConsolidateName,
            TA_type: TASK_TYPES.CONSOLIDATION,
            TA_overall_instructions: strings.ConsolidateOverallInstructions,
            TA_name: TASK_TYPES_TEXT.CONSOLIDATION,
            TA_assignee_constraints: [
                'student',
                'individual', {}
            ],
            TA_is_final_grade: true,
            TA_fields: {
                number_of_fields: 0,
                field_titles: [],
                field_distribution: {},
            }
        });

        this.disputeTask = createTaskObject({
            TA_display_name: strings.DisputeName,
            TA_type: TASK_TYPES.DISPUTE,
            TA_name: TASK_TYPES_TEXT.DISPUTE,
            TA_overall_instructions: strings.DisputeOverallInstructions,
            TA_at_duration_end: 'resolved',
            TA_what_if_late: null,
            TA_assignee_constraints: [
                'student',
                'individual', {}
            ],
            TA_fields: {
                number_of_fields: 1,
                field_titles: [strings.DisputeFieldName],
                field_distribution: {},
                0: {
                    title: strings.DisputeFieldName,
                    show_title: false,
                    assessment_type: null,
                    numeric_min: 0,
                    numeric_max: 40,
                    rating_max: 5,
                    list_of_labels: [strings.Easy,strings.Medium,strings.Difficult],
                    field_type: 'text',
                    requires_justification: false,
                    revise_and_resubmit: '',
                    instructions: strings.DisputeFieldInstructions,
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [
                        null, null
                    ],
                    default_content: ['', '']
                }
            }
        });

        this.resolveDisputeTask = createTaskObject({
            TA_display_name: strings.ResolveDisputeName,
            TA_type: TASK_TYPES.RESOLVE_DISPUTE,
            TA_name: TASK_TYPES_TEXT.RESOLVE_DISPUTE,
            TA_overall_instructions: strings.ResolveDisputeOverallInstructions,
            TA_assignee_constraints: [
                'instructor',
                'individual', {}
            ],
            TA_is_final_grade: true,
            TA_fields: {
                number_of_fields: 0,
                field_titles: [],
                field_distribution: {},
            }
        });

        // this.completeTask = createTaskObject({
        //     TA_display_name: 'Complete',
        //     TA_type: TASK_TYPES.COMPLETED,
        //     TA_documentation:'',
        //     TA_name: TASK_TYPES_TEXT.COMPLETED,
        //     TA_assignee_constraints: [
        //         'student', 'individual', {}
        //     ],
        //     TA_fields: null
        // });
        ///----------------------

        let standardWorkflow = [cloneDeep(this.createProblemTask)];

        //template for the standard workflow
        this.blankWorkflow = {
            WA_name: strings.DefaultWorkflowName,
            WA_type: '',
            CustomProblemTypes: [],
            WA_number_of_sets: 1,
            WA_documentation: '',
            WA_default_group_size: 1,
            WA_grade_distribution: {},
            NumberOfGradingTask: 0,
            Workflow: standardWorkflow,
            WorkflowStructure: cloneDeep(this.root) //this is the tree structure for that particular workflow
        };

        this.setState({
            AssignmentActivityData: {
                AA_userID: parseInt(this.props.UserID),
                AA_name: strings.DefaultAssignmentName,
                AA_course: parseInt(this.props.CourseID),
                AA_instructions: '',
                AA_type: '',
                AA_display_name: strings.DefaultAssignmentName,
                AA_section: null,
                AA_semester: null,
                AA_grade_distribution: {0: 100},
                AA_documentation: '',
                NumberofWorkflows: 1
            },
            WorkflowDetails: [cloneDeep(this.blankWorkflow)],
        });


    }

    componentWillMount() {
        //get components and semesters

        let coursesArray = null;
        let semestersArray = null;

        //Get the translated Strings
        this.props.__(this.state.Strings, (newStrings) => {
            this.setState({Strings: newStrings});


            //Get the semesters

            apiCall.get('/semester', (err, res, body) => {
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

                apiCall.get(`/course/getCourses/${this.props.UserID}`, (err, res, bod) => {
                    coursesArray = bod.Courses.map(function(course) {
                        return ({value: course.CourseID, label: course.Name, number: course.Number});
                    });
                    this.setState({
                        Courses: coursesArray
                    });
                });
            }else{
                apiCall.get(`/course/${this.props.CourseID}`, (err, res, bod2) => {

                    this.setState({
                        CourseID: this.props.CourseID,
                        CourseSelected: {
                            Name: bod2.Course.Name,
                            Number: bod2.Course.Number
                        }
                    });
                });

                
            }

            //Load partially made assignment from the database
            if(this.props.PartialAssignmentID !== ''){
                const assignmentOptions = {
                    userId: this.props.UserID,
                    courseId: this.props.CourseID === '*' ? undefined : this.props.CourseID
                };

                console.log(assignmentOptions);
                console.log('partialAssignmentURL:', `/partialAssignments/ById/${this.props.PartialAssignmentID}`);
                apiCall.get(`/partialAssignments/byId/${this.props.PartialAssignmentID}`,assignmentOptions, (err3, res3, assignBody) => {
                    console.log(assignBody, res3);

                    if(res3.statusCode !== 200 || assignBody == null || assignBody.PartialAssignment == null || assignBody.PartialAssignment.Data == null){
                        return;
                    }
                    this.makeTaskParameterTemplates();

                    this.onLoad(JSON.parse(assignBody.PartialAssignment.Data));
                    return this.setState({ Loaded: true});

                });
            } else {
                this.makeTaskParameterTemplates();
                this.makeDefaultWorkflowStructure(0);
                return this.setState({ Loaded: true});

            }

        });
    }

    /**
     * [clearCurrentStructure Unused right now but could be helpful for different default structures]
     * @param  {[number]} workflowIndex [the Workflow to clear]
     * @return {[void]}               [description]
     */
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
        // this.changeDataCheck('TA_allow_assessment', 2, workflowIndex);
        // this.changeDataCheck('Assess_Consolidate', 2, workflowIndex);
        // this.changeDataCheck('Assess_Dispute', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(1, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(2, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(2, 'not', 1, workflowIndex);
        //this.checkAssigneeConstraintTasks(3, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(3, 'same_as', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(4, 'same_as', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(5, 'not', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(5, 'not', 0, workflowIndex);
        this.checkAssigneeConstraintTasks(5, 'not', 3, workflowIndex);
        this.checkAssigneeConstraintTasks(6, 'same_as', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(7, 'not', 2, workflowIndex);
        this.checkAssigneeConstraintTasks(7, 'not', 6, workflowIndex);
    }

    componentDidMount() {


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
        console.log('AssignmentData onLoad',assignmentData.WorkflowActivity);
        let workflowData = clone(assignmentData.WorkflowActivity);
        delete assignmentData['WorkflowActivity'];
        let AA_Data = assignmentData;
        workflowData.forEach((workflow, index) => {
            console.log(workflow);
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
            showMessage(this.state.Strings.CourseIDNull);
            console.log('CourseID null');
            this.setState({
                InfoMessage: this.state.Strings.CourseIDNull,
                InfoMessageType: 'error'
            });
            return;
        }
        let sendData = cloneDeep(this.state.AssignmentActivityData);
        sendData.WorkflowActivity = cloneDeep(this.state.WorkflowDetails);
        sendData.WorkflowActivity.forEach((workflow, index) => {
            workflow.WorkflowStructure = this.flattenTreeStructure(workflow.WorkflowStructure);

        });

        const options = {
            assignment: sendData,
            userId: this.props.UserID,
            partialAssignmentId: this.state.PartialAssignmentID,
            courseId: this.state.AssignmentActivityData.AA_course
        };

        let x = this;

        apiCall.post('/assignment/save', options, (err, res, body) => {
            if (err == null && res.statusCode == 200) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                showMessage(this.state.Strings.SaveSuccessMessage);

                this.setState({
                    PartialAssignmentID: body.PartialAssignmentID,
                    InfoMessage: this.state.Strings.SaveSuccessMessage,
                    InfoMessageType: 'success'
                });

                
                setTimeout(function(){
                    x.setState({
                        InfoMessage: '',
                        InfoMessageType: ''
                    });
                }, 8000);
            } else {
                showMessage(this.state.Strings.ErrorMessage);
                this.setState({
                    InfoMessage: this.state.Strings.ErrorMessage,
                    InfoMessageType: 'error'
                });
                setTimeout(function(){
                    x.setState({
                        InfoMessage: '',
                        InfoMessageType: ''
                    });
                }, 8000);
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
            showMessage(this.state.Strings.CourseIDNull);
            console.log('CourseID null');
            this.setState({
                InfoMessage: this.state.Strings.CourseIDNull,
                InfoMessageType: 'error'
            });
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
                if(taskKey === 'simple'){
                    newGradeDist[taskKey] = workflow.WA_grade_distribution[taskKey];
                } else {
                    newGradeDist[mapping[taskKey]] = workflow.WA_grade_distribution[taskKey];

                }
            });

            workflow.WA_grade_distribution = newGradeDist;

            // B5 Link Fields in Tasks
            let taskTypesToLink = [TASK_TYPES.EDIT,TASK_TYPES.CONSOLIDATION, TASK_TYPES.DISPUTE, TASK_TYPES.RESOLVE_DISPUTE];
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
            assignment: sendData,
            userId: this.props.UserID,
            partialAssignmentId: this.state.PartialAssignmentID,
            courseId: sendData.AA_course
        };
        

        apiCall.post('/assignment/create', options, (err, res, body) => {
            if (err == null && res.statusCode == 200) {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                showMessage(this.state.Strings.SubmitSuccessMessage);
                this.setState({
                    InfoMessage: this.state.Strings.SubmitSuccessMessage,
                    InfoMessageType: 'success',
                    SubmitButtonShow: false});
            } else {
                console.log('Submit failed');
                showMessage(this.state.Strings.ErrorMessage);
                this.setState({
                    InfoMessage: this.state.Strings.ErrorMessage,
                    InfoMessageType: 'error'
                });
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



    addConsolidation(stateData, parentIndex, workflowIndex) {
        console.log(stateData, parentIndex, workflowIndex);
        if(this.hasConsolidate(parentIndex, workflowIndex)){
            return;
        }

        var selectedNode = stateData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });
        let needsConsolData = this.createNewTask(stateData, this.needsConsolidationTask, parentIndex, workflowIndex, 'Needs Consolidation of');
        let consolData = this.createNewTask(stateData, this.consolidationTask, parentIndex, workflowIndex, 'Consolidate');


        needsConsolData.TA_assignee_constraints = ['student', 'individual', {'same_as': [parentIndex]}];

        stateData[workflowIndex].Workflow.push(needsConsolData);
        stateData[workflowIndex].Workflow.push(consolData);

        let newNeedsConsolIndex = stateData[workflowIndex].Workflow.length - 2;
        let newConsolIndex = stateData[workflowIndex].Workflow.length - 1;



        let needsConsolidateNode = this.tree.parse({
            id: newNeedsConsolIndex
        });

        let consolidateNode = this.tree.parse({
            id: newConsolIndex
        });
        needsConsolidateNode = this.fillGaps(needsConsolidateNode, this.CONSOL_DISP_IDX);
        needsConsolidateNode.addChildAtIndex(consolidateNode, this.CONSOL_DISP_IDX);


        stateData[workflowIndex].Workflow[parentIndex].AllowConsolidation = true;
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

        stateData[workflowIndex].Workflow[newNeedsConsolIndex].TA_display_name = this.computeNewName(stateData,newNeedsConsolIndex, workflowIndex);
        stateData[workflowIndex].Workflow[newConsolIndex].TA_display_name = this.computeNewName(stateData,newConsolIndex, workflowIndex);

        return stateData;
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


    addDispute(stateData, parentIndex, workflowIndex) {
        stateData[workflowIndex].Workflow.push(this.createNewTask(stateData, this.disputeTask, parentIndex, workflowIndex, 'Dispute of '));
        stateData[workflowIndex].Workflow.push(this.createNewTask(stateData, this.resolveDisputeTask, parentIndex, workflowIndex, 'Resolve Dispute of'));

        let newDisputeIndex = stateData[workflowIndex].Workflow.length - 2;
        let newResolveDisputeIndex = stateData[workflowIndex].Workflow.length - 1;

        let disputeNode = this.tree.parse({
            id: newDisputeIndex
        });
        let resolveNode = this.tree.parse({
            id: newResolveDisputeIndex
        });

        disputeNode = this.fillGaps(disputeNode, this.CONSOL_DISP_IDX);
        disputeNode.addChildAtIndex(resolveNode, this.CONSOL_DISP_IDX);

        var selectedNode = stateData[workflowIndex].WorkflowStructure.first(function(node) {
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

        stateData[workflowIndex].Workflow[newDisputeIndex].TA_display_name = this.computeNewName(stateData,newDisputeIndex, workflowIndex);
        stateData[workflowIndex].Workflow[newResolveDisputeIndex].TA_display_name = this.computeNewName(stateData,newResolveDisputeIndex, workflowIndex);
        return stateData;
    }

    changeAssessment(parentIndex, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;

        let changeIndex = this.getAssessIndex(parentIndex, workflowIndex);
        let newTask = {};

        if (value == 'grade') {
            newTask = this.createNewTask(newData, this.gradeSolutionTask, parentIndex, workflowIndex, 'Grade');
        } else if (value == 'critique') {
            newTask = this.createNewTask(newData, this.critiqueSolutionTask, parentIndex, workflowIndex, 'Critique');
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
            newTask = this.createNewTask(newData, this.commmentProblemTask, parentIndex, workflowIndex, 'Comment on');
        } else if (value == 'edit') {
            newTask = this.createNewTask(newData, this.editProblemTask, parentIndex, workflowIndex, 'Edit');
        }

        newData[workflowIndex].Workflow[changeIndex] = newTask;

        this.setState({WorkflowDetails: newData});
    }

    /*** Adding task functions */
    addTask(stateData, type, index, workflowIndex) {
        let newTask = null;
        switch (type) {
        case this.ASSESS_IDX:
            newTask = this.createNewTask(stateData, this.gradeSolutionTask, index, workflowIndex, 'Grade');
            break;
        case this.REFLECT_IDX:
            newTask = this.createNewTask(stateData, this.editProblemTask, index, workflowIndex, 'Edit');
            break;
        case this.CREATE_IDX:
            newTask = this.createNewTask(stateData, this.createProblemTask, index, workflowIndex, 'Create');
            break;
        case this.SOLVE_IDX:
            newTask = this.createNewTask(stateData, this.solveProblemTask, index, workflowIndex, 'Solve');
            break;
        }
        let newTaskIndex = stateData[workflowIndex].Workflow.length;
        stateData[workflowIndex].Workflow.push(newTask);


        var selectedNode = stateData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == index;
        });

        let newNode = this.tree.parse({
            id: newTaskIndex
        });

        if (selectedNode.children[type] === undefined) {
            selectedNode = this.fillGaps(selectedNode, type);
            selectedNode.addChildAtIndex(newNode, type);
        } else {
            let dropped = selectedNode.children[type].drop();
            selectedNode.addChildAtIndex(newNode, type);
        }

        stateData[workflowIndex].Workflow[newTaskIndex].TA_display_name = this.computeNewName(stateData,newTaskIndex, workflowIndex);

        //This adds follow on tasks and specifies additional follow-on settings

        switch(type){
        case this.ASSESS_IDX:
            //add default assignee constraints
            let tasksToAvoid = this.getAlreadyCreatedTasks(newTaskIndex, workflowIndex, stateData);
            tasksToAvoid.forEach((task) => {
                stateData =  this.checkAssigneeConstraintTasks(newTaskIndex, 'not_in_workflow_instance', task.value, workflowIndex, stateData);
            });

            //add default consolidation task and dispte task
            stateData = this.changeDataCheck('Assess_Consolidate', index, workflowIndex, stateData);
            stateData = this.changeDataCheck('Assess_Dispute', index, workflowIndex, stateData);


            break;
        case this.REFLECT_IDX:
            break;
        case this.CREATE_IDX:
            stateData =  this.checkAssigneeConstraintTasks(newTaskIndex, 'not_in_workflow_instance', index, workflowIndex, stateData);
        
            stateData = this.changeDataCheck('TA_allow_reflection', newTaskIndex, workflowIndex, stateData);
            stateData = this.changeDataCheck('TA_leads_to_new_solution', newTaskIndex, workflowIndex, stateData);
            break;
        case this.SOLVE_IDX:
            stateData = this.changeDataCheck('TA_allow_assessment', newTaskIndex, workflowIndex, stateData);
            break;
        }
        return stateData;
    }

    createNewTask(stateData, taskType, index, workflowIndex, string) {
        let prevTaskName = stateData[workflowIndex].Workflow[index].TA_name;
        let newTask = cloneDeep(taskType);
        console.log(stateData, taskType, index, workflowIndex, string);
        console.log('New task:',newTask);
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

    /**
     * [computeNewName Returns a string of the task type concatenated with the previous task's name]
     * @param  {[type]} stateData     [passed down this.state.WorkflowDetails (may be ahead of actual state)]
     * @param  {[type]} taskIndex
     * @param  {[type]} workflowIndex
     * @return {[string]}            [new name string]
     */
    computeNewName(stateData, taskIndex, workflowIndex){
        let newName = '';
        let taskType = stateData[workflowIndex].Workflow[taskIndex].TA_type;
        let prefixString = '';
        switch(taskType){
        case TASK_TYPES.CREATE_PROBLEM:
            prefixString = 'Create';
            break;
        case TASK_TYPES.EDIT:
            prefixString = 'Edit';
            break;
        case TASK_TYPES.COMMENT:
            prefixString = 'Comment on';
            break;
        case TASK_TYPES.SOLVE_PROBLEM:
            prefixString = 'Solve';
            break;
        case TASK_TYPES.GRADE_PROBLEM:
            prefixString = 'Grade';
            break;
        case TASK_TYPES.CRITIQUE:
            prefixString = 'Critique';
            break;
        case TASK_TYPES.CONSOLIDATION:
            prefixString = 'Consolidate';
            break;
        case TASK_TYPES.DISPUTE:
            prefixString = 'Dispute of';
            break;
        case TASK_TYPES.RESOLVE_DISPUTE:
            prefixString = 'Resolve';
            break;
        }
        newName = prefixString;
        let previousTaskIndex = stateData[workflowIndex].WorkflowStructure
            .first((node) => {
                return node.model.id === taskIndex;
            }).parent.model.id;

        newName += (' ' + stateData[workflowIndex].Workflow[previousTaskIndex].TA_display_name);

        return newName;
    }
    /**
     * [propogateNameChangeDownTree sends name change in task down to other tasks]
     * @param  {[number]} startIndex    [index to begin searching the tree]
     * @param  {[number]} workflowIndex [workflow's array index]
     * @return {[void]}
     */
    propogateNameChangeDownTree(startIndex, workflowIndex){

        let newData = this.state.WorkflowDetails;
        let selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === startIndex;
        });

        selectedNode.walk(function(node){
            if(node.model.id === -1 || node.model.id === startIndex){
                return;
            }

            if(newData[workflowIndex].Workflow[node.model.id].CustomNameSet){
                return;
            }

            newData[workflowIndex].Workflow[node.model.id].TA_display_name = this.computeNewName(newData, node.model.id, workflowIndex);

        }, this);

        this.setState({
            WorkflowDetails: newData
        });
    }

    getAssessIndex(parentIndex, workflowIndex, stateData) {
        let workflowData = stateData || this.state.WorkflowDetails;
        var selectedNode = workflowData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == parentIndex;
        });
        if(selectedNode.children.length == 0 || selectedNode.children[this.ASSESS_IDX] == undefined || selectedNode.children[this.ASSESS_IDX].model.id == -1){
            return -1;
        }
        return selectedNode.children[this.ASSESS_IDX].model.id;

    }

    /**
     * [hasConsolidate checks whether given task has a consolidation task with it]
     * @param  {[number]}  taskIndex
     * @param  {[number]}  workflowIndex
     * @return {Boolean}
     */
    hasConsolidate(taskIndex, workflowIndex){
        let selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id == taskIndex;
        });

        if(!selectedNode.children[this.CONSOL_DISP_IDX]){
            return false;
        }

        if(!selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX]){
            return false;
        }

        let needsConsolIndex = selectedNode.children[this.CONSOL_DISP_IDX].model.id;
        let consolIndex = selectedNode.children[this.CONSOL_DISP_IDX].children[this.CONSOL_DISP_IDX].model.id;

        if(this.state.WorkflowDetails[workflowIndex].Workflow[consolIndex].TA_type === TASK_TYPES.CONSOLIDATION){
            return true;
        } else {
            return false;
        }
    }


    getConsolidationIndex(reflect, index, workflowIndex) {
        //see if reflect or assess has consolidate task and return its index
        //doesn't check if task is consol or dispute
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

    getReflectIndex(parentIndex, workflowIndex, stateData) {
        let workflowData = stateData || this.state.WorkflowDetails;
        var selectedNode = workflowData[workflowIndex].WorkflowStructure.first(function(node) {
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
        if(!this.hasConsolidate(parentIndex, workflowIndex)){
            return;
        }

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
        newData[workflowIndex].Workflow[parentIndex].AllowConsolidation = false;
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

    /**
     * [getParentIndex Gets the index of the task's direct parent]
     * @param  {[number]} taskIndex
     * @param  {[number]} workflowIndex
     * @return {[number]}               [parentId]
     */
    getParentIndex(taskIndex, workflowIndex){
        var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === taskIndex;
        });
        return selectedNode.parent.model.id;
    }

    setAssessNumberofParticipants(index, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        let x = this; //root.first changes this context, so need to save it here

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === x.getAssessIndex(index, workflowIndex);
        });


        newData[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant = value;
        if(value > 1){
            if(!this.hasConsolidate(selectedNode.model.id, workflowIndex)){
            //add consolidation task
                newData = this.addConsolidation(newData, selectedNode.model.id, workflowIndex);
            }
        } else {
            if(this.hasConsolidate(selectedNode.model.id, workflowIndex)){
            // remove consolidation task
                this.removeConsolidation(selectedNode.model.id, workflowIndex);
            }
        }
        this.setState({WorkflowDetails: newData});
    }







    /**
     * setReflectNumberofParticipants
     * [Changes the task's Reflect task's Number of participants and adds/removes consolidation task if needed]                                          ]
     * @param {[number]} index         [index of parent of Reflect task]
     * @param {[number]} workflowIndex
     * @param {[number]} value         [new numerical value]
     */
    setReflectNumberofParticipants(index, workflowIndex, value) {
        let newData = this.state.WorkflowDetails;
        let x = this; //root.first chnages this context, so need to save it here
        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node) {
            return node.model.id === x.getReflectIndex(index, workflowIndex);
        });

        newData[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant = value;

        if(value > 1){
            if(!this.hasConsolidate(selectedNode.model.id, workflowIndex)){
            //add consolidation task
                newData = this.addConsolidation(newData, selectedNode.model.id, workflowIndex);
            }
        } else {
            if(this.hasConsolidate(selectedNode.model.id, workflowIndex)){
            // remove consolidation task
                this.removeConsolidation(selectedNode.model.id, workflowIndex);
            }
        }

        this.setState({WorkflowDetails: newData});
    }
    //--------------------END TREE METHODS--------------------------------------

    ///////////////////////////////////////////////////////////////////////////
    ////////////// Task Activity change methods //////////////////////////////
    ///////////////////////////////////////////////////////////////////////////


    /**
     * [getParentID Gets the id of the 'owner' task of the task at taskIndex]
     * [The difference between this and getParentIndex is that the parent task is not
     *  necessarily the 'owner' task, as is the case with the tasks in the
     *  excludedTasks array below
     * ]
     * @param  {[Node]} root         [root of the tree to scan from, may not be the same as the state-stored root]
     * @param  {[state object]} workflowData [the workflow data to work with, may not be the same as the state-stored data]
     *                                        [corresponds to this.state.WorkflowDetails[index].Workflow]
     * @param  {[number]} taskIndex
     * @return {[number]}              [owner parent ID]
     */
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
        let linkedFields = cloneDeep(workflowData[linkedIndex].TA_fields);
        let linkedNumberOfFields = workflowData[linkedIndex].TA_fields.number_of_fields;
        let linkedFieldDistribution = workflowData[taskIndex].TA_fields.field_distribution;
        
        let oldFields = cloneDeep(workflowData[taskIndex].TA_fields);
        let oldNumberOfFields = workflowData[taskIndex].TA_fields.number_of_fields;
        let oldFieldTitles = workflowData[taskIndex].TA_fields.field_titles;
        let oldFieldDistribution = workflowData[taskIndex].TA_fields.field_distribution;
        
        workflowData[taskIndex].TA_fields = linkedFields;
        for(let i = 0; i < oldNumberOfFields; i++){
            workflowData[taskIndex].TA_fields[i + linkedNumberOfFields] = oldFields[i];
        }
        if(oldFieldDistribution !== undefined){
            let oldFieldDistFields =Object.keys(oldFieldDistribution);
            oldFieldDistFields.forEach((key) => {
                workflowData[taskIndex].TA_fields[linkedNumberOfFields + key] = oldFieldDistribution[key];
            });
        }
        

        workflowData[taskIndex].TA_fields.number_of_fields = oldNumberOfFields + linkedNumberOfFields;
        workflowData[taskIndex].TA_fields.field_titles = [...linkedFields.field_titles, ...oldFieldTitles];

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
        newData = this.refreshTaskFieldDistribution(taskIndex, workflowIndex, newData);
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    removeFieldButton(taskIndex, workflowIndex, fieldIndex){
        let newData = this.state.WorkflowDetails;
        delete newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex];
        newData[workflowIndex].Workflow[taskIndex].TA_fields.field_titles.splice(fieldIndex, 1);
        newData[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields -= 1;
        newData = this.refreshTaskFieldDistribution(taskIndex, workflowIndex, newData);
        console.log('RemoveFieldButton: ',newData);
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});

    }

    dropTask(taskClass, taskIndex, workflowIndex){
        let newData = this.state.WorkflowDetails;
        switch (taskClass) {
        case 'reflect':
            newData = this.removeTask(newData, this.REFLECT_IDX, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[taskIndex].TA_allow_reflection[0] = 'none';
            break;
        case 'assess':
            newData = this.removeTask(newData, this.ASSESS_IDX, taskIndex, workflowIndex);
            newData[workflowIndex].Workflow[taskIndex].TA_allow_assessment = 'none';
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

        newData = this.refreshGradeDist(newData, workflowIndex);

        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeDataCheck(stateField, taskIndex, workflowIndex, stateData) {
        console.log(stateField, taskIndex, workflowIndex, stateData);
        let newData = stateData || this.state.WorkflowDetails;
        switch (stateField) {
        case 'TA_allow_reflection':
            {
                if (newData[workflowIndex].Workflow[taskIndex][stateField][0] != 'none') {

                    let taskChildrenNodes = this.taskChildren(this.getReflectIndex(taskIndex, workflowIndex, newData), workflowIndex);

                    if(taskChildrenNodes.length ==0){
                        this.dropTask('reflect', taskIndex, workflowIndex);
                    } else {
                        let messageDiv = `${this.state.Strings.FollowingTasksWillDrop}:
                                <br />
                                <ul>
                                ${taskChildrenNodes.map((task)=>{ return (`<li>${task}</li>`);}).reduce((val, acc) => { return acc + val;}, '')}
                            </ul>
                            <br />
                            ${this.state.Strings.AreYouSureYouWantToContinue}?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: this.state.Strings.Ok,
                            cancelLabel: this.state.Strings.Cancel,
                            title: this.state.Strings.DroppingMultipleTask
                        }).then(()=>{
                            this.dropTask('reflect', taskIndex, workflowIndex);
                        }, () => {
                        }).catch(() => { });;
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
                    let taskChildrenNodes = this.taskChildren(this.getAssessIndex(taskIndex, workflowIndex, newData), workflowIndex);
                    if(taskChildrenNodes.length == 0){
                        this.dropTask('assess', taskIndex, workflowIndex);
                    } else {
                        let messageDiv = `${this.state.Strings.FollowingTasksWillDrop}:
                                <br />
                                <ul>
                            ${taskChildrenNodes.map((task) => { return (`<li>${task}</li>`); }).reduce((val, acc) => { return acc + val; }, '')}
                            </ul>
                            <br />
                            ${this.state.Strings.AreYouSureYouWantToContinue}?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: this.state.Strings.Ok,
                            cancelLabel: this.state.Strings.Cancel,
                            title: this.state.Strings.DroppingMultipleTask
                        }).then(() => {
                            this.dropTask('assess', taskIndex, workflowIndex);
                        }, () => {
                        }).catch(() => { });;
                    }
                } else {
                    newData = this.addTask(newData, this.ASSESS_IDX, taskIndex, workflowIndex);
                    newData = this.refreshGradeDist(newData, workflowIndex);
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
                        let messageDiv = `${this.state.Strings.FollowingTasksWillDrop}:
                                <br />
                                <ul>
                            ${taskChildrenNodes.map((task) => { return (`<li>${task}</li>`); }).reduce((val, acc) => { return acc + val; }, '')}
                            </ul>
                            <br />
                            ${this.state.Strings.AreYouSureYouWantToContinue}?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: this.state.Strings.Ok,
                            cancelLabel: this.state.Strings.Cancel,
                            title: this.state.Strings.DroppingMultipleTask
                        }).then(() => {
                            this.dropTask('create', taskIndex, workflowIndex);
                        }, () => {
                        }).catch(() => { });;
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
                        let messageDiv = `${this.state.Strings.FollowingTasksWillDrop}:
                                <br />
                                <ul>
                            ${taskChildrenNodes.map((task) => { return (`<li>${task}</li>`); }).reduce((val, acc) => { return acc + val; }, '')}
                            </ul>
                            <br />
                            ${this.state.Strings.AreYouSureYouWantToContinue}?`;
                        confirmModal({
                            confirmation: messageDiv,
                            list: taskChildrenNodes,
                            okLabel: this.state.Strings.Ok,
                            cancelLabel: this.state.Strings.Cancel,
                            title: this.state.Strings.DroppingMultipleTask
                        }).then(() => {
                            this.dropTask('solve', taskIndex, workflowIndex);
                        }, () => {
                        }).catch(() => { });;
                    }
                } else {
                    newData = this.addTask(newData, this.SOLVE_IDX, taskIndex, workflowIndex);
                    newData[workflowIndex].Workflow[taskIndex][stateField] = true;
                }
            }
            break;

        case 'Reflect_Consolidate':
            {
                if (this.hasConsolidate(this.getReflectIndex(taskIndex, workflowIndex, newData), workflowIndex)) {
                    this.removeConsolidation(this.getReflectIndex(taskIndex, workflowIndex, newData), workflowIndex);
                } else {
                    newData = this.addConsolidation(newData, this.getReflectIndex(taskIndex, workflowIndex, newData), workflowIndex);
                }
            }
            break;

        case 'Reflect_Dispute':
            {
                let reflectIndex = this.getReflectIndex(taskIndex, workflowIndex, newData);
                if (newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute) {
                    newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = false;
                    this.removeDispute(reflectIndex, workflowIndex);
                } else {
                    newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = true;
                    newData = this.addDispute(newData, reflectIndex, workflowIndex);
                }

            }
            break;

        case 'Assess_Consolidate':
            {
                if (this.hasConsolidate(this.getAssessIndex(taskIndex, workflowIndex, newData), workflowIndex)) {
                    this.removeConsolidation(this.getAssessIndex(taskIndex, workflowIndex, newData), workflowIndex);
                } else {
                    console.log('Assess consol index', this.getAssessIndex(taskIndex, workflowIndex, newData));
                    newData = this.addConsolidation(newData, this.getAssessIndex(taskIndex, workflowIndex, newData), workflowIndex);
                }
            }
            break;

        case 'Assess_Dispute':
            {
                let assessIndex = this.getAssessIndex(taskIndex, workflowIndex, newData);
                if (newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute) {
                    newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = false;
                    this.removeDispute(assessIndex, workflowIndex);

                } else {
                    newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = true;
                    newData = this.addDispute(newData, assessIndex, workflowIndex);
                }
                assessIndex = null;
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
        case 'TA_allow_revisions-child':
            {
                let reflectIndex = this.getReflectIndex(taskIndex, workflowIndex, newData);
                let newVal  = !newData[workflowIndex].Workflow[reflectIndex].TA_allow_revisions;
                newData[workflowIndex].Workflow[reflectIndex].TA_allow_revisions = newVal;
                newVal = null;
            }
            break;
        case 'AllowFileUpload':
            {
                if(newData[workflowIndex].Workflow[taskIndex].AllowFileUpload === true){
                    newData[workflowIndex].Workflow[taskIndex].TA_file_upload.mandatory = 0;
                    newData[workflowIndex].Workflow[taskIndex].TA_file_upload.optional = 0;
                }
                newData[workflowIndex].Workflow[taskIndex][stateField] = newData[workflowIndex].Workflow[taskIndex][stateField]
                    ? false
                    : true;
            }
            break;
        default:
            newData[workflowIndex].Workflow[taskIndex][stateField] = newData[workflowIndex].Workflow[taskIndex][stateField]
                ? false
                : true;
            break;
        }

        if(stateData === undefined){
            this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
            return;
        }
        else {
            return newData;
        }
    }

    changeDropdownData(stateField, taskIndex, workflowIndex, e) {
        let newData = this.state.WorkflowDetails;
        switch (stateField) {
        case 'TA_allow_reflection':
            {
                newData[workflowIndex].Workflow[taskIndex][stateField][0] = e.value;
                this.changeReflection(taskIndex, workflowIndex, e.value);
                this.propogateNameChangeDownTree(taskIndex, workflowIndex);
            }
            break;
        case 'TA_allow_reflection_wait':
            {
                newData[workflowIndex].Workflow[taskIndex].TA_allow_reflection[1] = e.value;
            }
            break;
        case 'TA_allow_assessment':
            {
                newData[workflowIndex].Workflow[taskIndex][stateField] = e.value;
                this.changeAssessment(taskIndex, workflowIndex, e.value);
                this.propogateNameChangeDownTree(taskIndex, workflowIndex);

            }
            break;
        case 'TA_assignee_constraints':
            newData[workflowIndex].Workflow[taskIndex][stateField][0] = e.value;
            if(e.value == 'instructor'){
                newData[workflowIndex].Workflow[taskIndex].SeeSameActivity = false;
            } else {
                newData[workflowIndex].Workflow[taskIndex].SeeSameActivity = true;
            }
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
            ? this.getReflectIndex(taskIndex, workflowIndex, newData)
            : this.getAssessIndex(taskIndex, workflowIndex, newData); // taskIndex of child (reflect/assess) node
        newData[workflowIndex].Workflow[target]['TA_assignee_constraints'][0] = e.value;
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    getAssigneeInChild(reflect, taskIndex, workflowIndex) {
        let targetIndex = (reflect ? this.getReflectIndex(taskIndex, workflowIndex) : this.getAssessIndex(taskIndex, workflowIndex));
        return this.state.WorkflowDetails[workflowIndex].Workflow[targetIndex]['TA_assignee_constraints'][0];
    }

    getTaskRevisioninChild(taskIndex, workflowIndex){
        let targetIndex = this.getReflectIndex(taskIndex, workflowIndex);

        return this.state.WorkflowDetails[workflowIndex].Workflow[targetIndex].TA_allow_revisions;
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


    checkAssigneeConstraintTasks(taskIndex, constraint, referId, workflowIndex, stateData) {
        let newData = stateData || this.state.WorkflowDetails;
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

        if(stateData == null){
            return this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});

        } else {
            console.log('data passed', newData);
            return newData;

        }
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
        } else if( stateField == 'field_type'){
            switch(e.value){
            case 'text':
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].default_content[0] = '';
                break;
            case 'numeric':
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].default_content[0] = 0;
                break;
            case 'assessment':
            case 'self assessment':
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].default_content[0] = 0;
                newData[workflowIndex].Workflow[taskIndex].TA_fields[field].assessment_type = 'grade';
                break;
            default:
                break;
            }
        }
        
        newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField] = e.value;
        if( stateField == 'field_type'){
            newData = this.refreshTaskFieldDistribution(taskIndex, workflowIndex, newData);
            console.log('Data after Refresh', newData);
                
        }

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
        let newVal = null;
        if(e.preventDefault !== undefined){
            e.preventDefault();
            if (e.target.id.includes("tiny")) {
                newVal = e.target.getContent();
            } else {
                newVal = e.target.value;
            }
        } else{
            newVal = e;
        }


        if (newVal > 45000) {
            return;
        }
        if (stateField == 'TA_display_name') {
            if (newVal > 254) {
                return;
            }
            //propogate name change down tree and save new val
            let newData = this.state.WorkflowDetails;
            const oldName = newData[workflowIndex].Workflow[taskIndex].TA_display_name;
            newData[workflowIndex].Workflow[taskIndex].TA_display_name = newVal;
            newData[workflowIndex].Workflow[taskIndex].CustomNameSet = true;
            this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
            this.propogateNameChangeDownTree(taskIndex, workflowIndex);

            return;
        }

        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[taskIndex][stateField] = newVal;
        console.log(e.target.getContent(), newData[workflowIndex].Workflow[taskIndex][stateField]);
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    changeInputFieldData(stateField, taskIndex, field, workflowIndex, e) {
        let newVal = null;
        if(e.preventDefault !== undefined){
            e.preventDefault();
            if (e.target.id.includes("tiny")) {
                newVal = e.target.getContent();
            } else {
                newVal = e.target.value;
            }
        } else{
            newVal = e;
        }

        if (newVal > 45000) {
            return;
        }
        let newData = this.state.WorkflowDetails;
        if (stateField == 'default_content') {
            newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField][0] = newVal;
        } else {
            newData[workflowIndex].Workflow[taskIndex].TA_fields[field][stateField] = newVal;
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
        case 'TA_number_participant':
            if(value > 1){
                if(!this.hasConsolidate(taskIndex, workflowIndex)){
                //add consolidation task
                    newData = this.addConsolidation(newData, taskIndex, workflowIndex);
                }
            } else {
                if(this.hasConsolidate(taskIndex, workflowIndex)){
                // remove consolidation task
                    this.removeConsolidation(taskIndex, workflowIndex);
                }
            }

            newData[workflowIndex].Workflow[taskIndex][stateField] = value;
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

    getTriggerConsolidationRadioOption(taskIndex, workflowIndex, isReflect){
        let targetIndex = this.getConsolidationIndex(isReflect, taskIndex, workflowIndex);
        return this.state.WorkflowDetails[workflowIndex].Workflow[targetIndex]['TA_trigger_consolidation_threshold'][1];
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

        if(temp === 'exists'){
            newData = this.refreshGradeDist(newData, workflowIndex);

        } else if (temp === 'none'){
            newData = this.refreshGradeDist(newData, workflowIndex);

        }
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

    getAlreadyCreatedTasks(currTaskIndex, workflowIndex, stateData) { //change to get from tree
        let tasksPath = new Array();
        const stateDataToCheck = stateData === undefined ?  this.state.WorkflowDetails : stateData;
        stateDataToCheck[workflowIndex].WorkflowStructure.walk(function(node) {

            if (node.model.id == currTaskIndex) {
                return false;
            }
            if (node.model.id != -1) {
                if (stateDataToCheck[workflowIndex].Workflow[node.model.id].TA_type !== TASK_TYPES.NEEDS_CONSOLIDATION) {
                    tasksPath.push({
                        value: node.model.id,
                        label: stateDataToCheck[workflowIndex].Workflow[node.model.id].TA_display_name
                    });

                }
            }

        }, this);

        return tasksPath;
    }

    



    getTaskFields(currTaskIndex, workflowIndex) {
        let returnList = [];
        const taskTypesToUseParentIndex = [TASK_TYPES.EDIT];
        const taskTypesToUseParentID = [TASK_TYPES.CONSOLIDATION, TASK_TYPES.DISPUTE, TASK_TYPES.RESOLVE_DISPUTE];
        //Difference here is that edit task has fields in its direct parent
        //Other tasks have to use getParentID to scan up the tree to find a task that actually has fields

        if (currTaskIndex == null) {
            return [];
        }
        let fieldList = this.state.WorkflowDetails[workflowIndex].Workflow[currTaskIndex].TA_fields.field_titles.map(function(title, fieldIndex) {
            return {value: `${currTaskIndex}:${fieldIndex}`, label: title};
        });
        let linkedTaskFieldsList = [];
        if(taskTypesToUseParentIndex.includes(this.state.WorkflowDetails[workflowIndex].Workflow[currTaskIndex].TA_type)){
            const parentIndex = this.getParentIndex(currTaskIndex, workflowIndex);
            linkedTaskFieldsList = this.state.WorkflowDetails[workflowIndex].Workflow[parentIndex].TA_fields.field_titles.map((title, fieldIndex) => {
                return {value: `${parentIndex}:${fieldIndex}`, label: title};
            });
        }
        if(taskTypesToUseParentID.includes(this.state.WorkflowDetails[workflowIndex].Workflow[currTaskIndex].TA_type)){
            const parentIndex = this.getParentID(this.state.WorkflowDetails[workflowIndex].WorkflowStructure, this.state.WorkflowDetails[workflowIndex].Workflow,currTaskIndex);
            linkedTaskFieldsList = this.state.WorkflowDetails[workflowIndex].Workflow[parentIndex].TA_fields.field_titles.map((title, fieldIndex) => {
                return {value: `${parentIndex}:${fieldIndex}`, label: title};
            });
        }

        return [...linkedTaskFieldsList,...fieldList ];
    }

    setDefaultField(defIndex, fieldIndex, taskIndex, workflowIndex, val) {
        let newData = this.state.WorkflowDetails;
        if(defIndex === 1){
            let newRefersToArray = val.split(':').map(i => parseInt(i));
            newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to = newRefersToArray;
            return this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});

        }
        newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to[defIndex] = val;
        return this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});

    }

    toggleDefaultFieldRefersTo(fieldIndex,taskIndex, workflowIndex){
        let newData = this.state.WorkflowDetails;
        if(newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to[0] == null){
            newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to = [0,null];
        } else {
            newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to = [null,null];
        }
        this.setState({WorkflowDetails: newData, LastTaskChanged: taskIndex});
    }

    isDefaultFieldRefersToToggled(fieldIndex,taskIndex, workflowIndex){
        if(this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to[0] == null)
            return false;
        else
            return true;
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

    getFieldDefaultContentValue(defaultFieldIndex, fieldIndex,taskIndex, workflowIndex){
        console.log('Get default field', defaultFieldIndex, this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to);
        if(defaultFieldIndex === 1){
            return `${this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to[0]}:${this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to[1]}`;
        } 
        return this.state.WorkflowDetails[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].default_refers_to[defaultFieldIndex];

        
    }

    getSeeSibblings(taskIndex, workflowIndex, isAssess){
        const targetIndex = (isAssess ? this.getAssessIndex(taskIndex, workflowIndex) : this.getReflectIndex(taskIndex, workflowIndex));
        return this.state.WorkflowDetails[workflowIndex].Workflow[targetIndex].SeeSibblings;
    }

    getAssessmentFieldsForTask(taskIndex, workflowIndex, stateData){
        let fieldsList = new Array();
        const stateDataToCheck = stateData === undefined ?  this.state.WorkflowDetails : stateData;
        let numberOfFields = stateDataToCheck[workflowIndex].Workflow[taskIndex].TA_fields.number_of_fields;

        for(let i = 0; i < numberOfFields; i++){
            if (stateDataToCheck[workflowIndex].Workflow[taskIndex].TA_fields[i].field_type === 'assessment' /*||
        stateDataToCheck[workflowIndex].Workflow[taskIndex].TA_fields[i].field_type === 'self assessment'*/) {
                fieldsList.push({
                    value: i,
                    label: stateDataToCheck[workflowIndex].Workflow[taskIndex].TA_fields[i].title
                });
            }
        }
        
        return fieldsList;

    }

    refreshTaskFieldDistribution(taskIndex, workflowIndex, stateData){
        let assessedFields  = this.getAssessmentFieldsForTask(taskIndex,workflowIndex, stateData);
        console.log('Assessed Fields' ,assessedFields);
        let newFieldDist = new Object();
        
        let count = assessedFields.length;
        if(count === 0){
            stateData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution = {};
            return stateData;
        }

        assessedFields.forEach(function(task) {
            newFieldDist[task.value] = Math.floor(100 / count);
        });
        newFieldDist[assessedFields[count - 1].value] +=  (100 % count);
        stateData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution = newFieldDist;
        return stateData;
    }

    changeTaskFieldDist(fieldIndex, taskIndex,workflowIndex, value){
        let newData = this.state.WorkflowDetails;
        let lastIndex = Object.keys(newData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution).length - 1;
        newData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution[fieldIndex] = value;

        let sum = Object.values(newData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution).reduce((cur, acc) => cur + acc, 0);
        if(sum > 100){
            let excess = sum - 100;
            if(fieldIndex == lastIndex){
                newData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution[lastIndex - 1] -= excess;
            }else{
                newData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution[lastIndex] -= excess;
            }
        } else if(sum < 100){
            let deficit = 100 - sum;
            if(fieldIndex == lastIndex){
                newData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution[lastIndex - 1] += deficit;
            }else{
                newData[workflowIndex].Workflow[taskIndex].TA_fields.field_distribution[lastIndex] += deficit;
            }
        }

        this.setState({
            WorkflowDetails: newData
        });

    }

    setSeeSibblings(taskIndex, workflowIndex, isAssess){
        const targetIndex = (isAssess ? this.getAssessIndex(taskIndex, workflowIndex) : this.getReflectIndex(taskIndex, workflowIndex));
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[targetIndex].SeeSibblings = !newData[workflowIndex].Workflow[targetIndex].SeeSibblings;

        this.setState({
            WorkflowDetails: newData
        });
    }

    setEvaluationByLabels(taskIndex, fieldIndex, workflowIndex, event){
        let newData = this.state.WorkflowDetails;
        let newVal = event.target.value.split(',');
        newData[workflowIndex].Workflow[taskIndex].TA_fields[fieldIndex].list_of_labels = newVal;
        this.setState({
            WorkflowDetails: newData
        });

    }



    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------

    //////////////////   Assignment Details Functions  //////////////////////////////////

    changeAssignmentInput(fieldName, event) {
        let newData = this.state.AssignmentActivityData;
        let content = event.target.value;
        if (event.target.id.includes("tiny")) {
            content = event.target.getContent();
        }
        if (content.length > 45000) {
            return;
        }
        if (fieldName == 'AA_name') {
            if (content.length > 254) {
                return;
            }
            newData.AA_display_name = content;
        }

        newData[fieldName] = content;
        this.setState({AssignmentActivityData: newData});
    }

    changeAssignmentDropdown(fieldName, event) {
        let newData = this.state.AssignmentActivityData;
        console.log(event);
        if(fieldName === 'AA_course'){
            newData[fieldName] = event.value;
            this.setState({AssignmentActivityData: newData, CourseSelected: {Name: event.label, Number: event.number}});
        }else {
            newData[fieldName] = event.value;
            this.setState({AssignmentActivityData: newData});
        }
        
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
                    let removeIndex = newWorkflowData.length-1;
                    newWorkflowData.pop();
                    difference -= 1;
                }
                newData[fieldName] = value;
                newData.AA_grade_distribution = this.makeNewAssignmentGradeDist(newWorkflowData.length);
                this.setState({AssignmentActivityData: newData, WorkflowDetails: newWorkflowData});
            }
            else if (difference < 0) {
                while (difference < 0) {
                    newWorkflowData.push(cloneDeep(this.blankWorkflow));
                    this.setState({WorkflowDetails: newWorkflowData});
                    this.makeDefaultWorkflowStructure(newWorkflowData.length-1);
                    difference += 1;
                }
                newData[fieldName] = value;
                newData.AA_grade_distribution = this.makeNewAssignmentGradeDist(newWorkflowData.length);
                this.setState({AssignmentActivityData: newData});
            }
        }
    }

    makeNewAssignmentGradeDist(workflowLength){
        let newGradeDist = {};
        let fairSharePoints = Math.floor(100 / workflowLength);
        let leftOverPoints = 100 % workflowLength;
        for(let i = 0; i < workflowLength; i++){
            newGradeDist[i] = fairSharePoints;
        }
        newGradeDist[0] += leftOverPoints;

        return newGradeDist;
    }

    /**
	 * Handler to change the Assignment's Grade Distribution of Workflows
	 * @param {number} workflowIndex 	Index of workflow that will be updated
	 * @param {number} value 	New value for the weight
	 */
    changeAssignmentGradeDist(workflowIndex, value){
        let newData = this.state.AssignmentActivityData;
        let lastIndex = Object.keys(newData.AA_grade_distribution).length - 1;
        newData.AA_grade_distribution[workflowIndex] = value;

        let sum = Object.values(newData.AA_grade_distribution).reduce((cur, acc) => cur + acc, 0);
        if(sum > 100){
            let excess = sum - 100;
            if(workflowIndex == lastIndex){
                newData.AA_grade_distribution[lastIndex - 1] -= excess;
            }else{
                newData.AA_grade_distribution[lastIndex] -= excess;
            }
        } else if(sum < 100){
            let deficit = 100 - sum;
            if(workflowIndex == lastIndex){
                newData.AA_grade_distribution[lastIndex - 1] += deficit;
            }else{
                newData.AA_grade_distribution[lastIndex] += deficit;
            }
        }

        this.setState({
            AssignmentActivityData: newData
        });

    }



    ////////////////    Workflow (Problem) Details functions    ////////////////////

    //addGradeDist(stateData, workflowIndex) {

    /** Will make a new, clean version of the workflow grade distribution.
     *  Clean means the points are distributed mostly evenly
     * @param {object} stateData
     * @param {number} workflowIndex
     */
    refreshGradeDist(stateData, workflowIndex)  {
        let gradedTasks = this.getFinalGradeTasksArray(workflowIndex, stateData);
        console.log('Grading tasks array,', gradedTasks);
        let newGradeDist = new Object();
        if(this.scanWorkflowForSimpleGrade(workflowIndex)){
            gradedTasks.push('simple');
        }
        let count = gradedTasks.length;


        gradedTasks.forEach(function(task) {
            newGradeDist[task] = Math.floor(100 / count);
        });
        newGradeDist[gradedTasks[gradedTasks.length - 1]] +=  (100 % count);
        stateData[workflowIndex].WA_grade_distribution = newGradeDist;
        stateData[workflowIndex].NumberOfGradingTask = count;
        /*
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

        } */

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

            stateData = this.addSimpleGradeToGradeDistribution(stateData, workflowIndex);
        }

        return stateData;
    }

    handleSelect(value) { //need this for the tabs that appear on multiple workflows
        this.setState({CurrentWorkflowIndex: value,SelectedTask: 0});
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


    /**
     * [addSimpleGradeToGradeDistribution Adds simple to Workflow Grade Distribution]
     * @param {number} workflowIndex
     */
    addSimpleGradeToGradeDistribution(stateData, workflowIndex){
        if('simple' in stateData[workflowIndex].WA_grade_distribution){
            return stateData;
        }
        stateData[workflowIndex].WA_grade_distribution['simple'] = 0;
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

    /**
     * [removeSimpleGradeFromGradeDistribution Removes the 'simple' value from the
     *                                         Workflow Grade distribution if needed]
     * @param  {[number]} workflowIndex
     * @return {[void]}
     */
    removeSimpleGradeFromGradeDistribution(workflowIndex){
        let stateData = this.state.WorkflowDetails;
        if(!('simple' in stateData[workflowIndex].WA_grade_distribution)){
            return;
        }

        if(this.scanWorkflowForSimpleGrade(workflowIndex)){
            return;
        } else {
            let stateData = this.state.WorkflowDetails;
            delete stateData[workflowIndex].WA_grade_distribution.simple;
            this.setState({
                WorkflowDetails: stateData
            });
            return;
        }


    }

    /**
     * [scanWorkflowForSimpleGrade Goes over the workflow to find if any tasks have
     *                             a simple grade. Returns true if it finds any that
     *                             aren't set to 'none']
     * @param  {number} workflowIndex
     * @return {boolean}
     */
    scanWorkflowForSimpleGrade(workflowIndex){
        let count = this.state.WorkflowDetails[workflowIndex].Workflow.length;
        for (var i = 0; i < count; i++) {
            if(this.state.WorkflowDetails[workflowIndex].Workflow[i].TA_simple_grade !== 'none'){
                return true;
            }
        }
        return false;

    }
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

    getFinalGradeTasksArray(workflowIndex, stateData = this.state.WorkflowDetails) { //gets a list of all the tasks that will be accounted for in grading distribution
        let newArray = new Array();
        let assessmentTypes = [TASK_TYPES.GRADE_PROBLEM];
        stateData[workflowIndex].Workflow.forEach(function(task, index) {
            if (Object.keys(task).length > 0) {
                if (assessmentTypes.includes(task.TA_type)) {
                    newArray.push(index);
                }
            }
        });

        if (newArray.length <= 0) {
            return [];
        }
        return newArray;
    }

    addCustomProblemType(workflowIndex, val){
        let newData = this.state.WorkflowDetails;
        newData[workflowIndex].CustomProblemTypes.push({value: val.value, label: val.label});
        this.setState({
            WorkflowDetails: newData
        });
    }
    ///---------------------------------------------------------------------------

    changeSelectedTask(val){ //if ever want to implement single task-based view
        this.setState({SelectedTask: val});
    }

    callTaskFunction(){
        //Passed to taskDetails to call every other function defined here.
        //This is just to pass only a few functions down
        const args = [].slice.call(arguments);
        const functionName = args.shift();
        return this[functionName](...args);
    }

    render() {
        let infoMessage = null;
        let submitButtonView = (
            <button  type="button" onClick={this.onSubmit.bind(this)}>
                <i className="fa fa-check"></i>{this.state.Strings.Submit}
            </button>
        );
        let saveButtonView = (<button onClick={this.onSave.bind(this)}>Save</button>);

        // if(this.state.SaveSuccess){
        //     infoMessage = (
        //       <span onClick={() => {
        //           this.setState({SubmitSuccess: false});
        //       }} className="small-info-message">
        //       <span className="success-message">
        //         {this.state.Strings.SaveSuccessMessage}
        //       </span>
        //       </span>
        //   );
        // }
        //
        // if (this.state.SubmitSuccess) {
        //     infoMessage = (
        //         <span onClick={() => {
        //             this.setState({SubmitSuccess: false});
        //         }} className="small-info-message">
        //         <span className="success-message">
        //           {this.state.Strings.SubmitSuccessMessage}
        //         </span>
        //         </span>
        //     );
        //
        // }
        // if (this.state.SubmitError && !this.state.SubmitSuccess) {
        //     infoMessage = (
        //         <span onClick={() => {
        //             this.setState({SubmitError: false});
        //         }} className="small-info-message">
        //         <div className="error-message">{this.state.Strings.ErrorMessage}</div>
        //         </span>
        //     );
        // }

        if(this.state.InfoMessage !== ''){
            infoMessage = (
                <span onClick={() => {
                    this.setState({InfoMessage: ''});
                }} className="small-info-message">
                    <span className={`${this.state.InfoMessageType}-message`}>
                        {this.state.InfoMessage}
                    </span>
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
                        if (workflow.Workflow[node.model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || workflow.Workflow[node.model.id].TA_type == TASK_TYPES.COMPLETED) {
                            return null;
                        }
                        if (Object.keys(workflow.Workflow[node.model.id]).length !== 0) {
                            tV.push(
                                <div className={node.model.id === this.state.SelectedTask
                                    ? 'workflow-task-list-item selected' : 'workflow-task-list-item' }
                                onClick={this.changeSelectedTask.bind(this, node.model.id)
                                }
                                key={`${index}-${node.model.id}-list-item`}
                                >
                                    {workflow.Workflow[node.model.id].TA_display_name}
                                </div>);
                        }
                    }
                }, this);

                tabListAr.push(
                    <Tab key={'tab stub ' + index}>{workflow.WA_name}</Tab>
                );
                tabPanelAr.push(
                    <TabPanel key={'tab ' + index}>
                        <div >
                            <ProblemDetailsComponent key={'Workflows' + index} workflowIndex={index}
                                WorkflowDetails={workflow}
                                NumberofWorkflows={this.state.AssignmentActivityData.NumberofWorkflows}
                                changeWorkflowData={this.changeWorkflowData.bind(this)}
                                changeWorkflowInputData={this.changeWorkflowInputData.bind(this)}
                                changeWorkflowDropdownData={this.changeWorkflowDropdownData.bind(this)}
                                changeWorkflowGradeDist={this.changeWorkflowGradeDist.bind(this)}
                                addCustomProblemType={this.addCustomProblemType.bind(this)}
                                Strings={this.state.Strings}
                            />
                            <br/>
                            <br/>
                            <div className='task-details-section'>
                                <div className='workflow-task-list'>
                                    {tV}
                                </div>
                                <div className='current-task-view'>
                                    <TaskDetailsComponent key={index + '-' + this.state.SelectedTask}
                                        index={this.state.SelectedTask}
                                        workflowIndex={index}
                                        LastTaskChanged={this.state.LastTaskChanged}
                                        TaskActivityData={this.state.WorkflowDetails[index].Workflow[this.state.SelectedTask]}
                                        isOpen={true}
                                        Strings={this.state.Strings}
                                        changeSelectedTask={this.changeSelectedTask.bind(this)}
                                        callTaskFunction={this.callTaskFunction.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
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
                    <div className="page-header">
                        <h2 className="title">{this.state.Strings.AssignmentEditor}&nbsp;&nbsp;&nbsp;{this.state.CourseSelected.Number} {this.state.CourseSelected.Name} </h2>
                    </div>
                    <HeaderComponent Strings={this.state.Strings} />
                    <div className="section-button-area add-margin-for-button">
                        {submitButtonView}
                    </div>
                    <div>
                        <AssignmentDetailsComponent AssignmentActivityData={this.state.AssignmentActivityData}
                            Courses={this.state.Courses} Semesters={this.state.Semesters}
					  WorkflowData={this.state.WorkflowDetails}
                            changeAssignmentNumeric={this.changeAssignmentNumeric.bind(this)}
                            changeAssignmentInput={this.changeAssignmentInput.bind(this)}
                            changeAssignmentDropdown={this.changeAssignmentDropdown.bind(this)}
                            changeAssignmentGradeDist={this.changeAssignmentGradeDist.bind(this)}
                            Strings={this.state.Strings}
                        />
                        <br />

                        {workflowsView}
                        <br/>
                        {infoMessage}
                        <div className="section-button-area add-margin-for-button">
                            <div className="faded-message-text">
                                {this.state.Strings.SubmitReminderMessage}
                            </div>
                            {saveButtonView}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default AssignmentEditorContainer;
