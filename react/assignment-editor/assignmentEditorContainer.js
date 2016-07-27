//The main component of the assignment editor. This calls the other components and passes in the methods defined here. The data is all made here and
// will be submitted from this component. This component has no views, it only contains data and components.

import React from 'react';
import request from 'request';
import TaskDetailsComponent from './taskDetails';
import AssignmentDetailsComponent from './assignmentDetails';
import ProblemDetailsComponent from './problemDetails';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
import {cloneDeep} from 'lodash';
var TreeModel = require('tree-model');
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';


class AssignmentEditorContainer extends React.Component{


    constructor(props){
      super(props);

      this.tree = new TreeModel();
      this.root = this.tree.parse({id:0});
      this.nullNode = this.tree.parse({id: -1});


      //need to add TA_name, TA_documentation, TA_trigger_consolidation_threshold

      this.createProblemTask = {
        TA_type: TASK_TYPES.CREATE_PROBLEM,
        TA_name: TASK_TYPE_TEXT.create_problem,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Create Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'test',
        TA_overall_rubric: 'y',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'P1',
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
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.editProblemTask = {
        TA_type: TASK_TYPES.EDIT,
        TA_name: TASK_TYPE_TEXT.edit,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Edit Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Edit this problem',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'P1.1',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.commmentProblemTask = {
        TA_type: TASK_TYPES.COMMENT,
        TA_name: TASK_TYPE_TEXT.comment,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Comment on Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Comment on this problem',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'P1.1',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.solveProblemTask = {
        TA_type: TASK_TYPES.SOLVE_PROBLEM,
        TA_name: TASK_TYPE_TEXT.solve_problem,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Solve the Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Solve this problem',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'S1',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.gradeSolutionTask = {
        TA_type: TASK_TYPES.GRADE_PROBLEM,
        TA_name: TASK_TYPE_TEXT.grade_problem,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Grade the Solution',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Grade this response',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 2,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'S1.1',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: 'grade',
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "assessment",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.critiqueSolutionTask = {
        TA_type: TASK_TYPES.CRITIQUE,
        TA_name: TASK_TYPE_TEXT.critique,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Critique Solution',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Critique this student\'s response',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 2,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'S1.1',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.needsConsolidationTask = {
        TA_type: TASK_TYPES.NEEDS_CONSOLIDATION,
        TA_name: TASK_TYPE_TEXT.needs_consolidation,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Needs Consolidation',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Determine whether the grades need consolidation',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'S1.2',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.consolidationTask = {
        TA_type: TASK_TYPES.CONSOLIDATION,
        TA_name: TASK_TYPE_TEXT.consolidation,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Consolidate',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        SimpleGradePointReduction: 0,
        TA_is_final_grade: false,
        TA_overall_instructions: 'Consolidate',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'S1.3',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.disputeTask = {
        TA_type: TASK_TYPES.DISPUTE,
        TA_name: TASK_TYPE_TEXT.dispute,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'resolved',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Dispute your grades',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Dispute',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution: false,
        TA_visual_id: 'S1.4',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.resolveDisputeTask = {
        TA_type: TASK_TYPES.RESOLVE_DISPUTE,
        TA_name: TASK_TYPE_TEXT.resolve_dispute,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Resolve',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        SimpleGradePointReduction: 0,
        TA_is_final_grade: false,
        TA_overall_instructions: 'Resolve the Dispute',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'S1.5',
        TA_fields: {
          number_of_fields: 1,
          field_titles: [''],
          0: {
                    title: '',
                    show_title: false,
                    assessment_type: null,
                    numeric_min: '0',
                    numeric_max: '40',
                    rating_max: '5',
                    list_of_labels: 'Easy, Medium, Difficult',
                    field_type: "text",
                    requires_justification: false,
                    instructions: '',
                    rubric: '',
                    justification_instructions: '',
                    default_refers_to: [null, null],
                    default_content: ['','']
                    }
        }
      };


      this.completeTask = {
        TA_type: TASK_TYPES.COMPLETED,
        TA_name: TASK_TYPE_TEXT.completed,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Complete',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',{}],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: '',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:false,
        TA_visual_id: 'C1',
        TA_fields: {
          number_of_fields: 0,
          field_titles: []
        }
      };

      let standardWorkflow = [cloneDeep(this.createProblemTask)];
      // let standardWorkflow = [this.createProblemTask, this.editProblemTask, this.solveProblemTask, this.gradeSolutionTask,
      //   this.needsConsolidationTask, this.consolidationTask, this.disputeTask, this.resolveDisputeTask, this.completeTask];

      //change Description to documentation
      //change all to WA_* format

      this.blankWorkflow={
        WA_name:'Problem',
        WA_type:'',
        WA_number_of_sets: 1,
        WA_documentation:'',
        WA_default_group_size: 1,
        WA_grade_distribution:{},
        Workflow: standardWorkflow,
        WorkflowStructure: cloneDeep(this.root)
      };


      this.state = {
          PCounter: 0, //this will hold the second digit of the VIS_ID of the Problem tasks, first digit is used as index of array
          SCounter: 0, //this will hold the second digit of the VIS_ID of the Solve tasks, first digit is used as index of array
          CurrentWorkflowIndex: 0,
          SubmitSuccess: false,
          SaveSuccess: false,
          SubmitError: false,
          Workflow: standardWorkflow,
          AssignmentActivityData: {
            AA_userID: parseInt(this.props.UserID),
            AA_name:'Assignment',
            AA_course:parseInt(this.props.CourseID),
            AA_instructions:'',
            AA_type:'',
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


    onSubmit(){
      console.log('clicked');

      let sendData = cloneDeep(this.state.AssignmentActivityData);
      sendData.WorkflowActivity = this.state.WorkflowDetails;
        console.log(typeof(sendData.AA_course) === 'number')
      const options = {
          method: 'POST',
          uri: this.props.apiUrl + '/api/assignment/create',
          body: {
              assignment: sendData
          },
          json: true
        };

        request(options, (err, res, body) => {
          console.log(res, err)
          if(err == null && res.statusCode == 200 ){
            console.log('Submitted Successfully');
            this.setState({SubmitSuccess: true});
          }
          else{
            console.log('Submit failed');
            this.setState({SubmitError: true});
          }
        });
    }

    ////////////// Task Activity change methods //////////////////////

    addFieldButton(index, workflowIndex){
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
                default_refers_to: [null, null],
                default_content: ['','']
              };
      newData[workflowIndex].Workflow[index].TA_fields.number_of_fields += 1;
      newData[workflowIndex].Workflow[index].TA_fields.field_titles.push('');

      this.setState({
        WorkflowDetails: newData
      })
    }


    addReflection( index, workflowIndex){ // add edit to slot 1 of 4 for nodes
      let newData = this.state.WorkflowDetails;
      newData[workflowIndex].Workflow.push(cloneDeep(this.editProblemTask));

      let selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == index;
      });

      if(selectedNode.children[0] !== undefined && selectedNode.children[0] !== this.nullNode){ // special case of reflecting  a reflect
        selectedNode.children[0].children[1] = this.tree.parse({id: newData[workflowIndex].Workflow.length-1});
      }
      else{
        selectedNode.children[0] = this.tree.parse({id: newData[workflowIndex].Workflow.length-1}); //general case
      }

      this.setState({WorkflowDetails: newData});


    }


    addAssessment(index, workflowIndex){
      //add a critique task to the tree-array; possibly consolidate and needs consol.
      let newData = this.state.WorkflowDetails;

      newData[workflowIndex].Workflow.push(cloneDeep(this.gradeSolutionTask));

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == index;
        });

      if(selectedNode.children[0] === undefined){
        selectedNode.children[0] = this.nullNode;
      }

      if(selectedNode.children[1] !== undefined && selectedNode.children[1] !== this.nullNode){
        selectedNode.children[1].children[1] = this.tree.parse({id: newData[workflowIndex].Workflow.length-1});
      }
      else{
        selectedNode.children[1] = this.tree.parse({id: newData[workflowIndex].Workflow.length-1});
      }

      this.setState({WorkflowDetails: newData});
    }


    addCreate(index, workflowIndex){
      let newData = this.state.WorkflowDetails;

      newData[workflowIndex].Workflow.push(cloneDeep(this.createProblemTask));

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == index;
        });

      if(selectedNode.children[0] === undefined){
        selectedNode.addChild(this.nullNode);
      }

      if(selectedNode.children[1] === undefined){
        selectedNode.addChild(this.nullNode);
      }

      selectedNode.children[2] = this.tree.parse({id: newData[workflowIndex].Workflow.length-1});

      this.setState({
        WorkflowDetails: newData
      });
    }


    addSolve(index, workflowIndex){
        let newData = this.state.WorkflowDetails;
        let newSolve = cloneDeep(this.solveProblemTask);
        newData[workflowIndex].Workflow.push(cloneDeep(this.solveProblemTask));

        var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
          return node.model.id == index;
          });

        if(selectedNode.children[0] === undefined){
          selectedNode.addChild(this.nullNode);
        }

        if(selectedNode.children[1] === undefined){
          selectedNode.addChild(this.nullNode);
        }

        if(selectedNode.children[2] === undefined){
          selectedNode.addChild(this.nullNode);
        }

        selectedNode.children[3] = this.tree.parse({id: newData[workflowIndex].Workflow.length-1});

        this.setState({
          WorkflowDetails: newData
        });
    }


    addConsolidationToReflect(parentIndex, workflowIndex){
      let newData = this.state.WorkflowDetails;

      newData[workflowIndex].Workflow.push(cloneDeep(this.needsConsolidationTask));
      newData[workflowIndex].Workflow.push(cloneDeep(this.consolidationTask));

      let consolidateNode = this.tree.parse({id:newData[workflowIndex].Workflow.length-2, children: [{id: newData[workflowIndex].Workflow.length-1}]});

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children[0] === undefined || selectedNode.children[0].model.id == -1){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[0] = consolidateNode;
      }
      else if(newData[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[0].children[1] === undefined || selectedNode.children[0].children[1].model.id == -1){
          let temp = selectedNode.children[0];
          selectedNode.children[0] = consolidateNode;
          selectedNode.children[0].children[0].children[0] = temp;
        }
        else{
          let temp = selectedNode.children[0];
          let temp2 = selectedNode.children[0].children[1];

          selectedNode.children[0] = consolidateNode;
          selectedNode.children[0].children[0].children[0] = temp;
          selectedNode.children[0].children[1] = temp2;
        }
      }
      else{
        let temp = selectedNode.children[0];
        selectedNode.children[0] = consolidateNode;
        selectedNode.children[0].children[1] = temp;
      }



      this.setState({
        WorkflowDetails: newData
      });
    }


    addConsolidationToAssess(parentIndex, workflowIndex){
      let newData = this.state.WorkflowDetails;

      newData[workflowIndex].Workflow.push(cloneDeep(this.needsConsolidationTask));
      newData[workflowIndex].Workflow.push(cloneDeep(this.consolidationTask));

      let consolidateNode = this.tree.parse({id:newData[workflowIndex].Workflow.length-2, children: [{id: newData[workflowIndex].Workflow.length-1}]});

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });
      if(selectedNode.children[0] === undefined){
        selectedNode.children[0] = this.nullNode;
      }
      if(selectedNode.children[1] === undefined || selectedNode.children[1].model.id == -1){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[1] = consolidateNode;
      }
      else if(newData[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[1].children[1] === undefined || selectedNode.children[1].children[1] === this.nullNode){
          let temp = selectedNode.children[1];
          selectedNode.children[1] = consolidateNode;
          selectedNode.children[1].children[0].children[0] = temp;

        }
        else{
          let temp = selectedNode.children[1];
          let temp2 = selectedNode.children[1].children[1];

          selectedNode.children[1] = consolidateNode;
          selectedNode.children[1].children[0].children[0] = temp;
          selectedNode.children[1].children[1] = temp2;
        }
      }
      else{
        let temp = selectedNode.children[1];
        selectedNode.children[1] = consolidateNode;
        selectedNode.children[1].children[1] = temp;
      }

      this.setState({
        WorkflowDetails: newData
      });
    }


    addDisputeToReflect(parentIndex, workflowIndex){
      let newData = this.state.WorkflowDetails;

      newData[workflowIndex].Workflow.push(cloneDeep(this.disputeTask));
      newData[workflowIndex].Workflow.push(cloneDeep(this.resolveDisputeTask));

      let disputeNode = this.tree.parse({id:newData[workflowIndex].Workflow.length-2, children: [{id: newData[workflowIndex].Workflow.length-1}]});

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children[0] === undefined || selectedNode.children[0] === this.nullNode){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[0] = disputeNode;

      }
      else if(newData[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION){
        selectedNode.children[0].children[0].children[0] = disputeNode;
      }
      else{
        let temp = selectedNode.children[0];
        selectedNode.children[0] = disputeNode;
        selectedNode.children[0].children[1] = temp;
      }

    }


    addDisputeToAssess(parentIndex, workflowIndex){ //all diputes and consolidates need another children[0] from parent Index
      let newData = this.state.WorkflowDetails;

      newData[workflowIndex].Workflow.push(cloneDeep(this.disputeTask));
      newData[workflowIndex].Workflow.push(cloneDeep(this.resolveDisputeTask));

      let disputeNode = this.tree.parse({id:newData[workflowIndex].Workflow.length-2, children: [{id: newData[workflowIndex].Workflow.length-1}]});

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children[0] === undefined){
        selectedNode.children[0] = this.nullNode;
      }
      if(selectedNode.children[1] === undefined ||selectedNode.children[1] == this.nullNode){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[1] = disputeNode;
        c
      }
      else if(newData[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION){
        selectedNode.children[1].children[0].children[0] = disputeNode;


      }
      else{

        let temp = selectedNode.children[1];
        selectedNode.children[1] = disputeNode;
        selectedNode.children[1].children[1] = temp;
      }

      this.setState({WorkflowDetails: newData});
    }


    removeReflect(parentIndex, workflowIndex){
      let newData = this.state.WorkflowDetails;
      let x = this;
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
        });


      let reflectIndex = selectedNode.children[0].model.id;

      selectedNode.children[0].walk(function(node){
        x.cleanAssigneeConstraints(node.model.id, workflowIndex);
        newData[workflowIndex].Workflow[node.model.id] ={};
      })

      selectedNode.children[0] = this.nullNode;


      this.setState({
        WorkflowDetails: newData
      });
    }


    removeAssess(parentIndex, workflowIndex){
      let x = this;
      let newData = this.state.WorkflowDetails;
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
        });


      let assessIndex = selectedNode.children[1].model.id;


      selectedNode.children[1].walk(function(node){
        x.cleanAssigneeConstraints(node.model.id, workflowIndex);
        newData[workflowIndex].Workflow[node.model.id] ={};
      });

      selectedNode.children[1] = this.nullNode;


      this.setState({
        WorkflowDetails: newData
      });

    }


    removeCreate(parentIndex , workflowIndex){
      let x = this;
      let newData = this.state.WorkflowDetails;

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
        });

      let createIndex = selectedNode.children[2].model.id;


      selectedNode.children[2].walk(function(node){
        x.cleanAssigneeConstraints(node.model.id, workflowIndex);
        newData[workflowIndex].Workflow[node.model.id] ={};
      });
      selectedNode.children[2].drop();

      this.setState({
        WorkflowDetails: newData
      });
    }


    removeSolve(parentIndex , workflowIndex){
      let x = this;
      let newData = this.state.WorkflowDetails;
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
        });

      let createIndex = selectedNode.children[3].model.id;

      selectedNode.children[3].walk(function(node){
        x.cleanAssigneeConstraints(node.model.id, workflowIndex);
        newData[workflowIndex].Workflow[node.model.id] ={};
      });
      selectedNode.children[3].drop();

      this.setState({
        WorkflowDetails: newData
      });
    }


    hasDispute(consoleNode, workflowIndex){
      if(consoleNode.children[0].children[0] !== undefined && this.state.WorkflowDetails[workflowIndex].Workflow[consoleNode.children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE){

        return true;
      }
      else{

        return false;
      }
    }


    removeConsolidationfromReflect(parentIndex , workflowIndex){
      let newData = this.state.WorkflowDetails;
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children.length ==0){
        return;
      }
      let x = this; //context variable
      let needsConsoleIndex = selectedNode.children[0].model.id;
      let consoleIndex = selectedNode.children[0].children[0].model.id;

      if(this.hasDispute(selectedNode.children[0])){
        let temp = selectedNode.children[0].children[0].children[0];
        if(selectedNode.children[0].children[1] == undefined){

          selectedNode.children[0].walk(function(node){
            if(node.model.id == selectedNode.children[0].children[0].children[0].model.id){
              return false;
            }
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          })

          selectedNode.children[0] = temp;
        }
        else{
          selectedNode.children[0].walk(function(node){
            if(node.model.id == selectedNode.children[0].children[0].children[0].model.id){
              return false;
            }
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          })

          let temp2 = selectedNode.children[0].children[1];
          selectedNode.children[0] = temp;
          selectedNode.children[0].children[1] = temp2;
        }
      }
      else{
          if(selectedNode.children[0].children[1] != undefined){
            let temp = selectedNode.children[0].children[1];
            selectedNode.children[0].walk(function(node){
              if(node != x.nullNode){
                newData[workflowIndex].Workflow[node.model.id] ={};
              }
            });
            selectedNode.children[0] = temp;
          }
          else{
          selectedNode.children[0].walk(function(node){
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });
          selectedNode.children[0] = this.nullNode;
        }
      }

      this.setState({WorkflowDetails: newData});
    }


    removeDisputeFromReflect(parentIndex , workflowIndex){
      let newData = this.state.WorkflowDetails;
      let x =this; //context preserving variable
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });


      if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[0].children[1] !== undefined && (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].children[1].model.id].TA_type === TASK_TYPES.EDIT || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].children[1].model.id].TA_type === TASK_TYPES.COMMENT)){
          let temp = selectedNode.children[0].children[1];
          selectedNode.children[0].walk(function(node){
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });
          selectedNode.children[0] = temp;
        }
        else{
          selectedNode.children[0].walk(function(node){
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });
        }
      }
      else {
        if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
          selectedNode.children[0].children[0].children[0].walk(function(node){
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });
        }
        else{

        }
      }

      this.setState({WorkflowDetails: newData});
    }


    removeConsolidationfromAssess(parentIndex, workflowIndex){
      let newData = this.state.WorkflowDetails;
      let x = this;

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });

      let needsConsoleIndex = selectedNode.children[1].model.id;
      let consoleIndex = selectedNode.children[1].children[0].model.id;

      if(this.hasDispute(selectedNode.children[1])){
        let temp = selectedNode.children[1].children[0].children[0];
        if(selectedNode.children[1].children[1] == undefined || selectedNode.children[1].children[1] == this.nullNode){

          selectedNode.children[1].walk(function(node){
            if(node.model.id == selectedNode.children[1].children[0].children[0].model.id){
              return false;
            }
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });

          selectedNode.children[1] = temp;

        }
        else{
          let temp2 = selectedNode.children[1].children[1];
          selectedNode.children[1].walk(function(node){
            if(node.model.id == selectedNode.children[1].children[0].children[0].model.id){
              return false;
            }
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });


          selectedNode.children[1] = temp;
          selectedNode.children[1].children[0] = temp2;
        }
      }
      else{
          if(selectedNode.children[1].children[1] != undefined && selectedNode.children[1].children[1] != this.nullNode){
            let temp = selectedNode.children[1].children[1];
            selectedNode.children[1].walk(function(node){

              if(node != x.nullNode){
                newData[workflowIndex].Workflow[node.model.id] ={};
              }
            });
            selectedNode.children[1] = temp;
          }
          else{
          selectedNode.children[1].walk(function(node){

            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });
          selectedNode.children[1] = this.nullNode;
        }
      }

      this.setState({WorkflowDetails: newData});
    }


    removeDisputeFromAssess(parentIndex, workflowIndex){
      let newData = this.state.WorkflowDetails;
      let x = this;
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });



      if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[1].children[1] !== undefined && (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].children[1].model.id].TA_type === TASK_TYPES.GRADE_PROBLEM || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].children[1].model.id].TA_type === TASK_TYPES.CRITIQUE)){
          let temp = selectedNode.children[1].children[1];
          selectedNode.children[1].walk(function(node){
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });
          selectedNode.children[1] = temp;
        }
        else{
          selectedNode.children[1].walk(function(node){
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
          });
        }
      }
      else {
        if (this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
          selectedNode.children[1].children[0].children[0].walk(function(node){
            if(node != x.nullNode){
              newData[workflowIndex].Workflow[node.model.id] ={};
            }
            });
        }
      }

      this.setState({WorkflowDetails: newData});
    }


    changeReflection(parentIndex, workflowIndex, value){

      let newData = this.state.WorkflowDetails;
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
        });

      let changeIndex = selectedNode.children[0].model.id;
      let newTask = {};

      if(value == 'comment'){
          newTask = this.commmentProblemTask;
        }
      else if(value == 'edit'){
          newTask = this.editProblemTask;
      }

      newData[workflowIndex].Workflow[changeIndex] = newTask;

      this.setState({WorkflowDetails: newData});
    }


    changeAssessment(parentIndex, workflowIndex, value){
      let newData = this.state.WorkflowDetails;

      let changeIndex = this.getAssessIndex(parentIndex, workflowIndex)
      let newTask = {};

      if(value == 'grade'){
        newTask = this.gradeSolutionTask;
      }
      else if(value == 'critique'){
        newTask = this.critiqueSolutionTask;
      }
      else{
        return;
      }
      newData[workflowIndex].Workflow[changeIndex] = newTask;

      this.setState({WorkflowDetails: newData});
    }


    getReflectIndex(parentIndex, workflowIndex){
      var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });

      if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.EDIT || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.COMMENT){
        return selectedNode.children[0].model.id;
      }
      else if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
        return selectedNode.children[0].children[1].model.id;
      }
    }


    getAssessIndex(parentIndex, workflowIndex){
      var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id == parentIndex;
      });

      if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.GRADE_PROBLEM || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.CRITIQUE){
        return selectedNode.children[1].model.id;
      }
      else if(this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.DISPUTE){
        return selectedNode.children[1].children[1].model.id;
      }
    }


    getReflectNumberofParticipants(index, workflowIndex){
      let x = this; //root.first chnages this context, so need to save it here

      var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id === x.getReflectIndex(index, workflowIndex);
      });

      return this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant;
    }


    setReflectNumberofParticipants(index, workflowIndex, value){
      let newData = this.state.WorkflowDetails;
      let x = this; //root.first chnages this context, so need to save it here
      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id === x.getReflectIndex(index, workflowIndex);
      });

      newData[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant = value;

      if(value <= 1 && newData[workflowIndex].Workflow[index].AllowConsolidations[0] == true){
        newData[workflowIndex].Workflow[index].AllowConsolidations[0] = false;
        this.removeConsolidationfromReflect(this.getReflectIndex(index, workflowIndex));
      }

      this.setState({WorkflowDetails: newData});
    }


    getAssessNumberofParticipants(index, workflowIndex){
      let x = this;

      //root.first changes this context, so need to save it here
      var selectedNode = this.state.WorkflowDetails[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id === x.getAssessIndex(index, workflowIndex);
      });
      return this.state.WorkflowDetails[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant;
    }


    setAssessNumberofParticipants(index, workflowIndex, value){
      let newData = this.state.WorkflowDetails;
      let x = this; //root.first chnages this context, so need to save it here

      var selectedNode = newData[workflowIndex].WorkflowStructure.first(function(node){
        return node.model.id === x.getAssessIndex(index, workflowIndex);
      });

      newData[workflowIndex].Workflow[selectedNode.model.id].TA_number_participant = value;

      if(value <= 1 && newData[workflowIndex].Workflow[index].AllowConsolidations[1] == true){
        newData[workflowIndex].Workflow[index].AllowConsolidations[1] = false;
        this.removeConsolidationfromAssess(this.getAssessIndex(index, workflowIndex), workflowIndex);
      }
      this.setState({WorkflowDetails: newData});
    }



    changeDataCheck(stateField, index, workflowIndex, firstIndex) { //+
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
                      this.removeConsolidationfromReflect(this.getReflectIndex(index, workflowIndex), workflowIndex);
                      newData[workflowIndex].Workflow[index].AllowConsolidations[0] = false;
                  } else {
                      this.addConsolidationToReflect(this.getReflectIndex(index, workflowIndex), workflowIndex);
                      newData[workflowIndex].Workflow[index].AllowConsolidations[0] = true;
                  }
              }
              break;

          case "Reflect_Dispute":
              {
                  let reflectIndex = this.getReflectIndex(index, workflowIndex);
                  if (newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute) {
                      newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = false;
                      this.removeDisputeFromReflect(reflectIndex, workflowIndex);
                  } else {
                      newData[workflowIndex].Workflow[reflectIndex].TA_allow_dispute = true;
                      this.addDisputeToReflect(reflectIndex, workflowIndex);
                  }

              }
              break;

          case "Assess_Consolidate":
            {
                if (newData[workflowIndex].Workflow[index].AllowConsolidations[1]) {
                    this.removeConsolidationfromReflect(this.getAssessIndex(index, workflowIndex), workflowIndex);
                    newData[workflowIndex].Workflow[index].AllowConsolidations[1] = false;
                } else {
                    this.addConsolidationToReflect(this.getAssessIndex(index, workflowIndex), workflowIndex);
                    newData[workflowIndex].Workflow[index].AllowConsolidations[1] = true;
                }
            }
              break;

          case 'Assess_Dispute':
            {
              let assessIndex = this.getAssessIndex(index, workflowIndex);
              if (newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute) {
                  newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = false;
                  this.removeDisputeFromReflect(assessIndex, workflowIndex);
              } else {
                  newData[workflowIndex].Workflow[assessIndex].TA_allow_dispute = true;
                  this.addDisputeToReflect(assessIndex, workflowIndex);
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


    changeDropdownData(stateField,index, workflowIndex, e){
      let newData = this.state.WorkflowDetails;
      if(stateField == 'TA_allow_reflection'){
        newData[workflowIndex].Workflow[index][stateField][0] = e.value;
        this.changeReflection(index, workflowIndex, e.value);
      }
      else if(stateField == 'TA_allow_assessment'){
        newData[workflowIndex].Workflow[index][stateField] = e.value;
        this.changeAssessment(index, workflowIndex, e.value);
      }
      else if(stateField == 'TA_assignee_constraint'){
        newData[workflowIndex].Workflow[index][stateField][0] = e.value;
      }
      else{
        newData[workflowIndex].Workflow[index][stateField] = e.value;
      }
      this.setState({
        WorkflowDetails: newData
      });
    }

    cleanAssigneeConstraints(deleteTaskIndex, workflowIndex){
      //will need to go through list of workflows, go to TA_assignee_constraint[2], go through ALL constraints keys, check if index is in the array, if it is, pop it
      let newData = this.state.WorkflowDetails;
      newData[workflowIndex].Workflow.forEach(function(task){
        if(Object.keys(task).length > 0){
          Object.keys(task.TA_assignee_constraint[2]).forEach(function(key){
            let inArray = task.TA_assignee_constraint[2][key].indexOf(deleteTaskIndex);
            if(inArray > -1){
              task.TA_assignee_constraint[2][key].splice(inArray, 1);
            }
          });
        }
      });

      this.setState({WorkflowDetails: newData});

    }

    checkAssigneeConstraints(index, constraint, workflowIndex){
      let newData = this.state.WorkflowDetails;

      if(constraint === 'none'){
        newData[workflowIndex].Workflow[index].TA_assignee_constraint[2] = {};
        this.setState({
          WorkflowDetails: newData
        });
        return;

      }

      if(newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint] === undefined){
         newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint] = [];
      }
      else{
        delete newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint];
      }

      this.setState({
        WorkflowDetails: newData
      })
    }


    checkAssigneeConstraintTasks(index, constraint, referId, workflowIndex){
      let newData = this.state.WorkflowDetails;
      let indexInArray = newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint].indexOf(referId);

      if(indexInArray > -1){
        newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint].splice(indexInArray, 1);
      }
      else{
        newData[workflowIndex].Workflow[index].TA_assignee_constraint[2][constraint].push(referId);
      }
      this.setState({WorkflowDetails: newData});
    }


    getAlreadyCreatedTasks(currTaskIndex, workflowIndex){
      let tasksList = [];

      this.state.WorkflowDetails[workflowIndex].Workflow.forEach(function(task, idx){
          if(idx != currTaskIndex){
            if(task != {}){
              if(task.TA_display_name !== undefined){
                tasksList.push({value: idx, label: task.TA_display_name});
              }
            }
          }

      });
      return tasksList;
    }


    changeDropdownFieldData(stateField,index,field, workflowIndex, e){
      let newData = this.state.WorkflowDetails;
        newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = e.value;

      this.setState({
        WorkflowDetails: newData
      });
    }


    changeFieldName(index, field, workflowIndex, e){
      let newData = this.state.WorkflowDetails;
      newData[workflowIndex].Workflow[index].TA_fields[field].title= e.target.value;
      newData[workflowIndex].Workflow[index].TA_fields.field_titles[field] = e.target.value;
      this.setState({
        WorkflowDetails: newData
      });
    }


    changeFieldCheck(stateField,index,field, workflowIndex){
      let newData = this.state.WorkflowDetails;
      newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = this.state.WorkflowDetails[workflowIndex].Workflow[index].TA_fields[field][stateField] ? false : true;
      this.setState({
        WorkflowDetails: newData
      });
    }


    changeFileUpload(taskIndex,firstIndex,secondIndex, workflowIndex,val){
      let newData = this.state.WorkflowDetails;
      newData[workflowIndex].Workflow[taskIndex].TA_file_upload[firstIndex][secondIndex] = val;
      this.setState({WorkflowDetails: newData});
    }


    changeInputData(stateField,index, workflowIndex, e){
      if(stateField == 'TA_display_name'){
        if(e.target.value.length > 50){
          return;
        }
      }
      let newData = this.state.WorkflowDetails;
      newData[workflowIndex].Workflow[index][stateField] = e.target.value;
      this.setState({
        WorkflowDetails: newData
      });
    }


    changeInputFieldData(stateField, index, field, workflowIndex, e){
      let newData = this.state.WorkflowDetails;
      if(stateField == 'default_content'){
        newData[workflowIndex].Workflow[index].TA_fields[field][stateField][0] = e.target.value;
      }
      else{
        newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = e.target.value;
      }
      this.setState({
        WorkflowDetails: newData
      });
    }


    changeNumericData(stateField, index, workflowIndex, value){
      let newData = this.state.WorkflowDetails;
      if(stateField == 'TA_due_type'){
        newData[workflowIndex].Workflow[index][stateField][1] = value;
      }
      else{
        newData[workflowIndex].Workflow[index][stateField] = value;
      }
      this.setState({
        WorkflowDetails: newData
      });
    }


    changeNumericFieldData(stateField, index, field, workflowIndex, value){
      let newData = this.state.WorkflowDetails;
      newData[workflowIndex].Workflow[index].TA_fields[field][stateField] = value;
      this.setState({
        WorkflowDetails: newData
      });
    }

    changeRadioData(stateField, index, workflowIndex, val){
      let newData = this.state.WorkflowDetails;
      if(stateField == 'TA_due_type'){
        newData[workflowIndex].Workflow[index][stateField][0] = val;
      }
      else{
        newData[workflowIndex].Workflow[index][stateField] = val;
      }
      this.setState({
        WorkflowDetails: newData
      });
    }


    changeSimpleGradeCheck(index, workflowIndex){
      let newData = this.state.WorkflowDetails;
      let temp = null;
      if(this.state.WorkflowDetails[workflowIndex].Workflow[index].TA_simple_grade == 'none'){
        temp = "exists";
      }
      else{
        temp = 'none';
      }

      newData[workflowIndex].Workflow[index].TA_simple_grade = temp;
      newData[workflowIndex].Workflow[index].SimpleGradePointReduction = 0;
      this.setState({
        WorkflowDetails: newData
      });
    }


    changeTASimpleGradeCheck(index, workflowIndex){

      let newData = this.state.WorkflowDetails;
      if(newData[workflowIndex].Workflow[index].TA_simple_grade != 'off_per_day(100)'){
        newData[workflowIndex].Workflow[index].TA_simple_grade = 'off_per_day(100)';
        newData[workflowIndex].Workflow[index].SimpleGradePointReduction = 100;
      }
      else{
        newData[workflowIndex].Workflow[index].TA_simple_grade = 'off_per_day(5)';
        newData[workflowIndex].Workflow[index].SimpleGradePointReduction = 5;
      }

      this.setState({
        WorkflowDetails: newData
      })
    }


    changeTASimpleGradePoints(index, workflowIndex,val){
        let newData = this.state.WorkflowDetails;
        if(val == 0){
          newData[workflowIndex].Workflow[index].TA_simple_grade = 'exists';

        }
        else{
          newData[workflowIndex].Workflow[index].TA_simple_grade = 'off_per_day(' + val + ')';

        }

        newData[workflowIndex].Workflow[index].SimpleGradePointReduction = val;

        this.setState({
          WorkflowDetails: newData
        });

    }


/////////////   Assignment Details Functions  //////////////////////////////////

    changeAssignmentInput(fieldName, event){
      if(fieldName == 'AA_name'){
        if(event.target.value.length > 255){
          return;
        }
      }
        let newData = this.state.AssignmentActivityData;
        newData[fieldName] = event.target.value;
        this.setState({
          AssignmentActivityData: newData
        });
      }

      changeAssignmentDropdown(fieldName, event){
        let newData = this.state.AssignmentActivityData;
        newData[fieldName] = event.value;
        this.setState({
          AssignmentActivityData: newData
        });
      }

      changeAssignmentNumeric(fieldName, value){
        let newData = this.state.AssignmentActivityData;
        let newWorkflowData = this.state.WorkflowDetails;

        if(isNaN(parseFloat(value))){
          return;
        }
        // uncomment this only when multiple workflows are properly handled !
        if(fieldName == 'NumberofWorkflows'){
          let difference = this.state.AssignmentActivityData.NumberofWorkflows - value;
          console.log(difference);
          if(difference > 0){
            while(difference > 0){
              newWorkflowData.pop();
              difference -= 1;
            }
          }
          else if(difference < 0){
            while(difference < 0){
              newWorkflowData.push(cloneDeep(this.blankWorkflow));
              difference += 1;
            }
          }
        }

        newData[fieldName] = value;
        this.setState({
          AssignmentActivityData: newData
        });
      }


////////////////    Workflow (Problem) Details functions    ////////////////////

  handleSelect(value){
    this.setState({CurrentWorkflowIndex: value});
  }


  changeWorkflowData(stateField,workflowIndex, value){
    let newWorkflowDetails = this.state.WorkflowDetails;
    newWorkflowDetails[workflowIndex][stateField] = value;
    this.setState({
      WorkflowDetails: newWorkflowDetails
    });
  }


  changeWorkflowInputData(stateField,workflowIndex, e){
    if(stateField == 'WA_name'){
      if(e.target.value.length > 30){
        return;
      }
    }
    let newWorkflowDetails = this.state.WorkflowDetails;
    newWorkflowDetails[workflowIndex][stateField] = e.target.value;
    this.setState({
      WorkflowDetails: newWorkflowDetails
    });
  }


  changeWorkflowDropdownData(stateField, workflowIndex, e){
    let newWorkflowDetails = this.state.WorkflowDetails;
    newWorkflowDetails[workflowIndex][stateField] = e.value;
    this.setState({
      WorkflowDetails: newWorkflowDetails
    });
  }

  render(){
    let infoMessage = null;
    console.log(typeof(this.props.UserID) === 'number')
    console.log(typeof(this.props.CourseID) === 'number')

    if(this.state.SubmitSuccess){
      infoMessage = (<span onClick={() => {this.setState({SubmitSuccess: false})}} style={{backgroundColor: '#00AB8D', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px rgb(0, 171, 141)'}}> Successfully created assignment! </span>);
    }
    if(this.state.SubmitError){
      infoMessage = (<span onClick={() => {this.setState({SubmitError: false})}} style={{backgroundColor: '#ed5565', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px #ed5565'}}>Submit Error! Please check your work and try again </span>);
    }
    let tabListAr = [];
    let tabPanelAr = [];
    let workflowsView = null;

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

                                   />
          {tasksView}
         </div>)
    }
    else{
      this.state.WorkflowDetails.forEach(function(workflow,index){
        let tasksView = workflow.Workflow.map( function(task, taskIndex){
          // will probably need to move this into problemDetails.js to support
          // multiple workflows
          if(task.TA_type == TASK_TYPES.NEEDS_CONSOLIDATION){
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
                                       changeWorkflowDropdownData={this.changeWorkflowDropdownData.bind(this)} />
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
                                      changeAssignmentNumeric={this.changeAssignmentNumeric.bind(this)}
                                      changeAssignmentInput={this.changeAssignmentInput.bind(this)}
                                      changeAssignmentDropdown={this.changeAssignmentDropdown.bind(this)}
                                          />
          <br />
          {workflowsView}
          <br />

          <button type="button" className="divider"onClick={this.onSubmit.bind(this)}><i className="fa fa-check">Submit</i></button>
        </div>
      );
    }
}

export default AssignmentEditorContainer;
