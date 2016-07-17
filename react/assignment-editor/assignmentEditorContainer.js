//The main component of the assignment editor. This calls the other components and passes in the methods defined here. The data is all made here and
// will be submitted from this component. This component has no views, it only contains data and components.

import React from 'react';
import TaskDetailsComponent from './taskDetails';
import AssignmentDetailsComponent from './assignmentDetails';
import ProblemDetailsComponent from './problemDetails';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
import {cloneDeep} from 'lodash';
var TreeModel = require('tree-model');


class AssignmentEditorContainer extends React.Component{


    constructor(props){
      super(props);

      this.tree = new TreeModel();
      this.root = this.tree.parse({id:0});
      this.nullNode = this.tree.parse({id: -1});

//@auto-fold here
      this.createProblemTask = {
        TA_type: TASK_TYPES.CREATE_PROBLEM,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Create Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

//@auto-fold here
      this.editProblemTask = {
        TA_type: TASK_TYPES.EDIT,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Edit Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.commmentProblemTask = {
        TA_type: TASK_TYPES.COMMENT,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Comment on Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.solveProblemTask = {
        TA_type: TASK_TYPES.SOLVE_PROBLEM,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Solve the Problem',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,
        TA_overall_instructions: 'Solve this problem',
        TA_overall_rubric: '',
        TA_allow_reflection: ['none',"don't wait"],
        TA_allow_assessment: 'grade',
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

      //@auto-fold here
      this.gradeSolutionTask = {
        TA_type: TASK_TYPES.GRADE_PROBLEM,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Grade the Solution',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.critiqueSolutionTask = {
        TA_type: TASK_TYPES.CRITIQUE,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Critique Solution',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.needsConsolidationTask = {
        TA_type: TASK_TYPES.NEEDS_CONSOLIDATION,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Needs Consolidation',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.consolidationTask = {
        TA_type: TASK_TYPES.CONSOLIDATION,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Consolidate',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.disputeTask = {
        TA_type: TASK_TYPES.DISPUTE,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'resolved',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Dispute your grades',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.resolveDisputeTask = {
        TA_type: TASK_TYPES.RESOLVE_DISPUTE,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Resolve',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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

      //@auto-fold here
      this.completeTask = {
        TA_type: TASK_TYPES.COMPLETED,
        SimpleGradePointReduction: 0,
        AllowConsolidations: [false, false],
        TA_file_upload: [[0,"mandatory"],[0,'optional']],
        TA_due_type: ['duration', 4320],
        TA_start_delay:0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'Keep same participant',
        TA_display_name: 'Complete',
        TA_one_or_separate: false,
        TA_assignee_constraint: ['student','individual',null],
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


      // let standardWorkflow = [this.createProblemTask, this.editProblemTask, this.solveProblemTask, this.gradeSolutionTask,
      //   this.needsConsolidationTask, this.consolidationTask, this.disputeTask, this.resolveDisputeTask, this.completeTask];

      let standardWorkflow = [cloneDeep(this.createProblemTask)];
      this.state = {
          PCounter: [0], //this will hold the second digit of the VIS_ID of the Problem tasks, first digit is used as index of array
          SCounter: [0], //this will hold the second digit of the VIS_ID of the Solve tasks, first digit is used as index of array
          CurrentTaskIndex: 0,
          Workflow: standardWorkflow
      };
    }

    continueToNextTask(nextTask){
      let newCurrent = this.state.CurrentTaskIndex;

      this.setState({CurrentTaskIndex: newCurrent});
    }


    ////////////// Task Activity change methods //////////////////////

//@auto-fold here
    addFieldButton(index){
      let newData = this.state.Workflow;
      newData[index].TA_fields[newData[index].TA_fields.number_of_fields] = {
                title: '',
                show_title: false,
                assessment_type: null,
                numeric_min: '0',
                numeric_max: null,
                rating_max: '5',
                list_of_labels: 'Easy, Medium, Difficult',
                field_type: "text",
                requires_justification: false,
                instructions: '',
                rubric: '',
                justification_instructions: '',
                default_refers_to: [null, null],
                default_content: ['','']
              };
      newData[index].TA_fields.number_of_fields += 1;
      newData[index].TA_fields.field_titles.push('');

      this.setState({
        Workflow: newData
      })
    }

//@auto-fold here
    addReflection( index ){ // add edit to slot 1 of 4 for nodes.



      let newWorkflows = this.state.Workflow;
      newWorkflows.push(cloneDeep(this.editProblemTask));

      let selectedNode = this.root.first(function(node){
        return node.model.id == index;
      });

      if(selectedNode.children[0] !== undefined && selectedNode.children[0] !== this.nullNode){ // special case of reflecting  a reflect
        selectedNode.children[0].children[1] = this.tree.parse({id: newWorkflows.length-1});
      }
      else{
        selectedNode.children[0] = this.tree.parse({id: newWorkflows.length-1}); //general case
      }

      this.setState({Workflow: newWorkflows});


    }

    //@auto-fold here
    addAssessment(index){
      //add a critique task to the tree-array; possibly consolidate and needs consol.
      let newWorkflows = this.state.Workflow;

      newWorkflows.push(cloneDeep(this.gradeSolutionTask));

      var selectedNode = this.root.first(function(node){
        return node.model.id == index;
        });

      if(selectedNode.children[0] === undefined){
        selectedNode.children[0] = this.nullNode;
      }

      if(selectedNode.children[1] !== undefined && selectedNode.children[1] !== this.nullNode){
        selectedNode.children[1].children[1] = this.tree.parse({id: newWorkflows.length-1});
      }
      else{
        selectedNode.children[1] = this.tree.parse({id: newWorkflows.length-1});
      }

      this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    addCreate(index){
      let newWorkflows = this.state.Workflow;

      newWorkflows.push(cloneDeep(this.createProblemTask));

      var selectedNode = this.root.first(function(node){
        return node.model.id == index;
        });

      if(selectedNode.children[0] === undefined){
        selectedNode.addChild(this.nullNode);
      }

      if(selectedNode.children[1] === undefined){
        selectedNode.addChild(this.nullNode);
      }

      selectedNode.children[2] = this.tree.parse({id: newWorkflows.length-1});

      this.setState({
        Workflow: newWorkflows
      });
    }

//@auto-fold here
    addSolve(index){
        let newWorkflows = this.state.Workflow;

        newWorkflows.push(cloneDeep(this.solveProblemTask));

        var selectedNode = this.root.first(function(node){
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

        selectedNode.children[3] = this.tree.parse({id: newWorkflows.length-1});

        this.setState({
          Workflow: newWorkflows
        });
    }

//@auto-fold here
    addConsolidationToReflect(parentIndex){
      let newWorkflows = this.state.Workflow;

      newWorkflows.push(cloneDeep(this.needsConsolidationTask));
      newWorkflows.push(cloneDeep(this.consolidationTask));

      let consolidateNode = this.tree.parse({id:newWorkflows.length-2, children: [{id: newWorkflows.length-1}]});

      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children[0] === undefined || selectedNode.children[0].model.id == -1){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[0] = consolidateNode;
      }
      else if(newWorkflows[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[0].children[1] === undefined){
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
        Workflow: newWorkflows
      });
    }

//@auto-fold here
    addConsolidationToAssess(parentIndex){
      let newWorkflows = this.state.Workflow;

      newWorkflows.push(cloneDeep(this.needsConsolidationTask));
      newWorkflows.push(cloneDeep(this.consolidationTask));

      let consolidateNode = this.tree.parse({id:newWorkflows.length-2, children: [{id: newWorkflows.length-1}]});

      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });
      if(selectedNode.children[0] === undefined){
        selectedNode.children[0] = this.nullNode;
      }
      if(selectedNode.children[1] === undefined || selectedNode.children[1].model.id == -1){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[1] = consolidateNode;
      }
      else if(newWorkflows[selectedNode.children[1].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[1].children[1] === undefined){
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
        Workflow: newWorkflows
      });
    }

//@auto-fold here
    addDisputeToReflect(parentIndex){
      let newWorkflows = this.state.Workflow;

      newWorkflows.push(cloneDeep(this.disputeTask));
      newWorkflows.push(cloneDeep(this.resolveDisputeTask));

      let disputeNode = this.tree.parse({id:newWorkflows.length-2, children: [{id: newWorkflows.length-1}]});

      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children[0] === undefined || selectedNode.children[0] === this.nullNode){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[0] = disputeNode;

      }
      else if(newWorkflows[selectedNode.children[0].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION){
        selectedNode.children[0].children[0].children[0] = disputeNode;
      }
      else{
        let temp = selectedNode.children[0];
        selectedNode.children[0] = disputeNode;
        selectedNode.children[0].children[1] = temp;
      }

    }

//@auto-fold here
    addDisputeToAssess(parentIndex){ //all diputes and consolidates need another children[0] from parent Index
      let newWorkflows = this.state.Workflow;

      newWorkflows.push(cloneDeep(this.disputeTask));
      newWorkflows.push(cloneDeep(this.resolveDisputeTask));

      let disputeNode = this.tree.parse({id:newWorkflows.length-2, children: [{id: newWorkflows.length-1}]});

      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children[0] === undefined){
        selectedNode.children[0] = this.nullNode;
      }
      if(selectedNode.children[1] === undefined ||selectedNode.children[1] === this.nullNode){ //special case of adding consol after instructor has already added a reflect to reflection task
        selectedNode.children[1] = disputeNode;
      }
      else if(newWorkflows[selectedNode.children[1].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION){
        selectedNode.children[1].children[0].children[0] = disputeNode;
      }
      else{
        let temp = selectedNode.children[1];
        selectedNode.children[1] = disputeNode;
        selectedNode.children[1].children[1] = temp;
      }

      this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    removeReflect(parentIndex){

      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
        });


      let reflectIndex = selectedNode.children[0].model.id;
      let newWorkflows = this.state.Workflow;

      selectedNode.children[0].walk(function(node){
        newWorkflows[node.model.id] ={};
      })

      selectedNode.children[0] = this.nullNode;


      this.setState({
        Workflow: newWorkflows
      });
    }

//@auto-fold here
    removeAssess(parentIndex){
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
        });


      let assessIndex = selectedNode.children[1].model.id;
      let newWorkflows = this.state.Workflow;

      selectedNode.children[1].walk(function(node){
        newWorkflows[node.model.id] ={};
      })

      selectedNode.children[1] = this.nullNode;


      this.setState({
        Workflow: newWorkflows
      });

    }

    //@auto-fold here
    removeCreate(parentIndex){
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
        });

      let createIndex = selectedNode.children[2].model.id;
      let newWorkflows = this.state.Workflow;

      newWorkflows[createIndex] = {};
      selectedNode.children[2].drop();

      this.setState({
        Workflow: newWorkflows
      });
    }

    //@auto-fold here
    removeSolve(parentIndex){
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
        });

      let createIndex = selectedNode.children[3].model.id;
      let newWorkflows = this.state.Workflow;

      selectedNode.children[3].walk(function(node){
        newWorkflows[node.model.id] ={};
      })
      selectedNode.children[3].drop();

      this.setState({
        Workflow: newWorkflows
      });
    }

//@auto-fold here
    hasDispute(consoleNode){
      if(consoleNode.children[0].children[0] !== undefined && this.state.Workflow[consoleNode.children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE){

        return true;
      }
      else{

        return false;
      }
    }

//@auto-fold here
    removeConsolidationfromReflect(parentIndex){
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      if(selectedNode.children.length ==0){
        return;
      }

      let needsConsoleIndex = selectedNode.children[0].model.id;
      let consoleIndex = selectedNode.children[0].children[0].model.id;
      let newWorkflows = this.state.Workflow;

      if(this.hasDispute(selectedNode.children[0])){
        let temp = selectedNode.children[0].children[0].children[0];
        if(selectedNode.children[0].children[1] == undefined){

          selectedNode.children[0].walk(function(node){
            if(node.model.id == selectedNode.children[0].children[0].children[0].model.id){
              return false;
            }
            newWorkflows[node.model.id] ={};
          })

          selectedNode.children[0] = temp;
        }
        else{
          selectedNode.children[0].walk(function(node){
            if(node.model.id == selectedNode.children[0].children[0].children[0].model.id){
              return false;
            }
            newWorkflows[node.model.id] ={};
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
              console.log(node.model.id);
              newWorkflows[node.model.id] ={};
            });
            selectedNode.children[0] = this.nullNode;
            selectedNode.children[0].children[1] = temp;
          }
          else{
          selectedNode.children[0].walk(function(node){
            console.log(node.model.id);
            newWorkflows[node.model.id] ={};
          });
          selectedNode.children[0] = this.nullNode;
        }
      }

      this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    removeDisputeFromReflect(parentIndex){
      let newWorkflows = this.state.Workflow;
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      console.log("Removing dispute at this index",selectedNode.children[0].model.id);

      if(this.state.Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[0].children[1] !== undefined && (this.state.Workflow[selectedNode.children[0].children[1].model.id].TA_type === TASK_TYPES.EDIT || this.state.Workflow[selectedNode.children[0].children[1].model.id].TA_type === TASK_TYPES.COMMENT)){
          let temp = selectedNode.children[0].children[1];
          selectedNode.children[0].walk(function(node){
            console.log(node.model.id);
            newWorkflows[node.model.id] ={};
          });
          selectedNode.children[0] = temp;
        }
        else{
          selectedNode.children[0].walk(function(node){
            console.log(node.model.id);
            newWorkflows[node.model.id] ={};
          });
        }
      }
      else {
        if (this.state.Workflow[selectedNode.children[0].children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
          selectedNode.children[0].children[0].children[0].walk(function(node){
            console.log(node.model.id);
            newWorkflows[node.model.id] ={};
          });
        }
        else{

        }
      }

      this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    removeConsolidationfromAssess(parentIndex){
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      let needsConsoleIndex = selectedNode.children[1].model.id;
      let consoleIndex = selectedNode.children[1].children[0].model.id;
      let newWorkflows = this.state.Workflow;

      if(this.hasDispute(selectedNode.children[1])){
        let temp = selectedNode.children[1].children[0].children[0];
        if(selectedNode.children[1].children[1] == undefined || selectedNode.children[1].children[1] == this.nullNode){

          selectedNode.children[1].walk(function(node){
            if(node.model.id == selectedNode.children[1].children[0].children[0].model.id){
              return false;
            }
            newWorkflows[node.model.id] ={};
          });

          selectedNode.children[1] = temp;

        }
        else{
          selectedNode.children[1].walk(function(node){
            if(node.model.id == selectedNode.children[1].children[0].children[0].model.id){
              return false;
            }
            newWorkflows[node.model.id] ={};
          });

          let temp2 = selectedNode.children[1].children[1];
          selectedNode.children[1] = temp;
          selectedNode.children[1].children[0] = this.nullNode;
          selectedNode.children[1].children[1] = temp2;
        }
      }
      else{
          if(selectedNode.children[1].children[1] != undefined && selectedNode.children[1].children[1] != this.nullNode){
            let temp = selectedNode.children[1].children[1];
            selectedNode.children[1].walk(function(node){

              newWorkflows[node.model.id] ={};
            });
            selectedNode.children[1] = temp;
          }
          else{
          selectedNode.children[1].walk(function(node){

            newWorkflows[node.model.id] ={};
          });
          selectedNode.children[1] = this.nullNode;
        }
      }

      this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    removeDisputeFromAssess(parentIndex){
      let newWorkflows = this.state.Workflow;
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });



      if(this.state.Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.DISPUTE){
        if(selectedNode.children[1].children[1] !== undefined && (this.state.Workflow[selectedNode.children[1].children[1].model.id].TA_type === TASK_TYPES.EDIT || this.state.Workflow[selectedNode.children[1].children[1].model.id].TA_type === TASK_TYPES.COMMENT)){
          let temp = selectedNode.children[1].children[1];
          selectedNode.children[1].walk(function(node){
            newWorkflows[node.model.id] ={};
          });
          selectedNode.children[1] = temp;
        }
        else{
          selectedNode.children[1].walk(function(node){
            newWorkflows[node.model.id] ={};
          });
        }
      }
      else {
        if (this.state.Workflow[selectedNode.children[1].children[0].children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
          selectedNode.children[1].children[0].children[0].walk(function(node){

            newWorkflows[node.model.id] ={};
          });
        }
        else{

        }
      }

      this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    changeReflection(parentIndex, value){

      let newWorkflows = this.state.Workflow;
      var selectedNode = this.root.first(function(node){
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

      newWorkflows[changeIndex] = newTask;

      this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    changeAssessment(parentIndex, value){
      let newWorkflows = this.state.Workflow;

      let changeIndex = this.getAssessIndex(parentIndex)
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
      newWorkflows[changeIndex] = newTask;

      this.setState({Workflow: newWorkflows});
    }

//////////////////
//////////////////  General StateChange functions
/////////////////

//@auto-fold here
    getReflectIndex(parentIndex){
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      if(this.state.Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.EDIT || this.state.Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.COMMENT){
        return selectedNode.children[0].model.id;
      }
      else if(this.state.Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || this.state.Workflow[selectedNode.children[0].model.id].TA_type == TASK_TYPES.DISPUTE){
        return selectedNode.children[0].children[1].model.id;
      }
    }

//@auto-fold here
    getAssessIndex(parentIndex){
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
      });

      if(this.state.Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.GRADE_PROBLEM || this.state.Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.CRITIQUE){
        return selectedNode.children[1].model.id;
      }
      else if(this.state.Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.NEEDS_CONSOLIDATION || this.state.Workflow[selectedNode.children[1].model.id].TA_type == TASK_TYPES.DISPUTE){
        return selectedNode.children[1].children[1].model.id;
      }
    }

//@auto-fold here
    getReflectNumberofParticipants(index){
      let x = this; //root.first chnages this context, so need to save it here

      var selectedNode = this.root.first(function(node){
        return node.model.id === x.getReflectIndex(index);
      });

      return this.state.Workflow[selectedNode.model.id].TA_number_participant;
    }

//@auto-fold here
    setReflectNumberofParticipants(index, value){
      let newWorkflows = this.state.Workflow;
      let x = this; //root.first chnages this context, so need to save it here
      var selectedNode = this.root.first(function(node){
        return node.model.id === x.getReflectIndex(index);
      });

    newWorkflows[selectedNode.model.id].TA_number_participant = value;

    if(value <= 1 && newWorkflows[index].AllowConsolidations[0] == true){
      newWorkflows[index].AllowConsolidations[0] = false;
      this.removeConsolidationfromReflect(this.getReflectIndex(index));
    }

    this.setState({Workflow: newWorkflows});
    }

//@auto-fold here
    getAssessNumberofParticipants(index){

      let x = this;

      //root.first changes this context, so need to save it here
      var selectedNode = this.root.first(function(node){
        return node.model.id === x.getAssessIndex(index);
      });
      return this.state.Workflow[selectedNode.model.id].TA_number_participant;
    }

//@auto-fold here
    setAssessNumberofParticipants(index, value){
      let newWorkflows = this.state.Workflow;
      let x = this; //root.first chnages this context, so need to save it here

      var selectedNode = this.root.first(function(node){
        return node.model.id === x.getAssessIndex(index);
      });

      newWorkflows[selectedNode.model.id].TA_number_participant = value;

      if(value <= 1 && newWorkflows[index].AllowConsolidations[1] == true){
        newWorkflows[index].AllowConsolidations[1] = false;
        this.removeConsolidationfromAssess(this.getAssessIndex(index));
      }
      this.setState({Workflow: newWorkflows});
    }


//@auto-fold here
    changeDataCheck(stateField, index) {
    let newData = this.state.Workflow;
    switch (stateField) {
        case "TA_allow_reflection":
            {
                if (newData[index][stateField][0] != 'none') {
                    this.removeReflect(index);
                    newData[index][stateField][0] = 'none';
                } else {
                    newData[index][stateField][0] = 'edit';
                    this.addReflection(index);
                }
            }
            break;

        case "TA_allow_assessment":
            {
                if (newData[index][stateField] != 'none') {
                    this.removeAssess(index);
                    newData[index][stateField] = 'none';
                } else {
                    this.addAssessment(index);
                    newData[index][stateField] = 'grade';
                }
            }
            break;
        case "TA_leads_to_new_problem":
            {
                if (newData[index][stateField]) {
                    this.removeCreate(index);
                    newData[index][stateField] = false;
                } else {
                    this.addCreate(index);
                    newData[index][stateField] = true;
                }
            }
            break;
        case "TA_leads_to_new_solution":
            {
                if (newData[index][stateField]) {
                    this.removeSolve(index);
                    newData[index][stateField] = false;
                } else {
                    this.addSolve(index);
                    newData[index][stateField] = true;
                }
            }
            break;

        case "Reflect_Consolidate":
            {
                if (newData[index].AllowConsolidations[0]) {
                    this.removeConsolidationfromReflect(this.getReflectIndex(index));
                    newData[index].AllowConsolidations[0] = false;
                } else {
                    this.addConsolidationToReflect(this.getReflectIndex(index));
                    newData[index].AllowConsolidations[0] = true;
                }
            }
            break;

        case "Reflect_Dispute":
            {
                let reflectIndex = this.getReflectIndex(index);
                if (newData[reflectIndex].TA_allow_dispute) {
                    newData[reflectIndex].TA_allow_dispute = false;
                    this.removeDisputeFromReflect(reflectIndex);
                } else {
                    newData[reflectIndex].TA_allow_dispute = true;
                    this.addDisputeToReflect(reflectIndex);
                }

            }
            break;

        case "Assess_Consolidate":
          {
              if (newData[index].AllowConsolidations[1]) {
                console.log('removed consolidate')
                  this.removeConsolidationfromAssess(this.getAssessIndex(index));
                  newData[index].AllowConsolidations[1] = false;
              } else {
                console.log('added consolidate')
                  this.addConsolidationToAssess(this.getAssessIndex(index));
                  newData[index].AllowConsolidations[1] = true;
              }
          }
            break;

        case 'Assess_Dispute':
          {
            let assessIndex = this.getAssessIndex(index);
            if (newData[assessIndex].TA_allow_dispute) {
              console.log('removed dispute')
                newData[assessIndex].TA_allow_dispute = false;
                this.removeDisputeFromAssess(assessIndex);
            } else {
              console.log('added dispute')
                newData[assessIndex].TA_allow_dispute = true;
                this.addDisputeToAssess(assessIndex);
            }
          }
            break;

        case "TA_assignee_constraint":
            {
                if (newData[index][stateField][1] != 'group') {
                    newData[index][stateField][1] = 'group';
                } else {
                    newData[index][stateField][1] = 'individual';
                }
            }
            break;

        default:
            newData[index][stateField] = this.state.Workflow[index][stateField]
                ? false
                : true;
            break;
    }

    this.setState({Workflow: newData});
}

//@auto-fold here
    changeDropdownData(stateField,index, e){
      let newData = this.state.Workflow;
      if(stateField == 'TA_allow_reflection'){
        newData[index][stateField][0] = e.value;
        this.changeReflection(index, e.value);
      }
      else if(stateField == 'TA_allow_assessment'){
        newData[index][stateField] = e.value;
        this.changeAssessment(index, e.value);
      }
      else if(stateField == 'TA_assignee_constraint'){
        newData[index][stateField][0] = e.value;
      }
      else{
        newData[index][stateField] = e.value;
      }
      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeDropdownFieldData(stateField,index,field, e){
      let newData = this.state.Workflow;
        newData[index].TA_fields[field][stateField][0] = e.value;

      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeFieldName(index, field, e){
      let newData = this.state.Workflow;
      newData[index].TA_fields[field].title= e.target.value;
      newData[index].TA_fields.field_titles[field] = e.target.value;
      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeFieldCheck(stateField,index,field){
      let newData = this.state.Workflow;
      newData[index].TA_fields[field][stateField] = this.state.Workflow[index].TA_fields[field][stateField] ? false : true;
      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeFileUpload(workflowIndex,firstIndex,secondIndex,val){
      let newData = this.state.Workflow;
      newData.TA_file_upload[firstIndex][secondIndex] = val;
      this.setState({Workflow: newData});
    }

//@auto-fold here
    changeInputData(stateField,index, e){
      let newData = this.state.Workflow;
      newData[index][stateField] = e.target.value;
      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeInputFieldData(stateField, index, field, e){
      let newData = this.state.Workflow;
      if(stateField == 'default_content'){
        newData[index].TA_fields[field][stateField][0] = e.target.value;
      }
      else{
        newData[index].TA_fields[field][stateField] = e.target.value;
      }
      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeNumericData(stateField, index, value){
      let newData = this.state.Workflow;
      if(stateField == 'TA_due_type'){
        newData[index][stateField][1] = value;
      }
      else{
        newData[index][stateField] = value;
      }
      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeNumericFieldData(stateField, index, field, value){
      let newData = this.state.Workflow;
      newData[index].TA_fields[field][stateField] = value;
      this.setState({
        Workflow: newData
      });
    }
//@auto-fold here
    changeRadioData(stateField,index,val){
      let newData = this.state.Workflow;
      if(stateField == 'TA_due_type'){
        newData[index][stateField][0] = val;
      }
      else{
        newData[index][stateField] = val;
      }
      this.setState({
        Workflow: newData
      });
    }

//@auto-fold here
    changeSimpleGradeCheck(index){
      let newData = this.state.Workflow;
      let temp = null;
      if(this.state.Workflow[index].TA_simple_grade == 'none'){
        temp = "exists";
      }
      else{
        temp = 'none';
      }

      newData[index].TA_simple_grade = temp;
      newData[index].SimpleGradePointReduction = 0;
      this.setState({
        WorkFlow: newData
      });
    }

//@auto-fold here
    changeTASimpleGradeCheck(index){

      let newData = this.state.Workflow;
      if(newData[index].TA_simple_grade != 'off_per_day(100)'){
        newData[index].TA_simple_grade = 'off_per_day(100)';
        newData[index].SimpleGradePointReduction = 100;
      }
      else{
        newData[index].TA_simple_grade = 'off_per_day(5)';
        newData[index].SimpleGradePointReduction = 5;
      }

      this.setState({
        Workflow: newData
      })
    }

//@auto-fold here
    changeTASimpleGradePoints(index,val){
        let newData = this.state.Workflow;
        if(val == 0){
          newData[index].TA_simple_grade = 'exists';

        }
        else{
          newData[index].TA_simple_grade = 'off_per_day(' + val + ')';

        }

        newData[index].SimpleGradePointReduction = val;

        this.setState({
          Workflow: newData
        });

    }



    render(){
      console.log(this.state.Workflow);


      let tasksView = this.state.Workflow.map( function(task, index){
        if(Object.keys(task).length !== 0 ){
        return (<TaskDetailsComponent key={index} index={index}
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
                              />);
          }
          else{
            return null;
          }
      },this);

      return (
        <div>
          <div className='placeholder'></div>
          <AssignmentDetailsComponent/>
          <br />
          <ProblemDetailsComponent />
          <br />
          {tasksView}

        </div>
      );
    }
}

export default AssignmentEditorContainer;
