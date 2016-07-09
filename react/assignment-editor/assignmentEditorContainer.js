//The main component of the assignment editor. This calls the other components and passes in the methods defined here. The data is all made here and
// will be submitted from this component. This component has no views, it only contains data and components.

import React from 'react';
import TaskDetailsComponent from './taskDetails';
import AssignmentDetailsComponent from './assignmentDetails';
import ProblemDetailsComponent from './problemDetails';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
var TreeModel = require('tree-model');


class AssignmentEditorContainer extends React.Component{


    constructor(props){
      super(props);

      this.tree = new TreeModel();
      this.root = this.tree.parse({id:0});

      this.createProblemTask = {
        TA_type: TASK_TYPES.CREATE_PROBLEM,
        SimpleGradePointReduction: 0,
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
        TA_allow_assessment: 'grade',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute:false,
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution:true,
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

      this.editProblemTask = {
        TA_type: TASK_TYPES.EDIT,
        SimpleGradePointReduction: 0,
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
      this.commmentProblemTask = {
        TA_type: TASK_TYPES.COMMENT,
        SimpleGradePointReduction: 0,
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
      this.solveProblemTask = {
        TA_type: TASK_TYPES.SOLVE_PROBLEM,
        SimpleGradePointReduction: 0,
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
        TA_leads_to_new_solution:true,
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
        SimpleGradePointReduction: 0,
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
        TA_allow_dispute:true,
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
        SimpleGradePointReduction: 0,
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
        TA_number_participant: 1,
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
        SimpleGradePointReduction: 0,
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
      this.consolidationTask = {
        TA_type: TASK_TYPES.CONSOLIDATION,
        SimpleGradePointReduction: 0,
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
      this.disputeTask = {
        TA_type: TASK_TYPES.DISPUTE,
        SimpleGradePointReduction: 0,
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
      this.resolveDisputeTask = {
        TA_type: TASK_TYPES.RESOLVE_DISPUTE,
        SimpleGradePointReduction: 0,
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
      this.completeTask = {
        TA_type: TASK_TYPES.COMPLETED,
        SimpleGradePointReduction: 0,
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

      let standardWorkflow = [this.createProblemTask];
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


    addEdit( index ){
      console.log("Added Edit");
      let newWorkflows = this.state.Workflow;

      newWorkflows.push(this.editProblemTask);

      var selectedNode = this.root.first(function(node){
        return node.model.id == index;
        });
      if(selectedNode.children[0] === undefined){
        selectedNode.children[0] = this.tree.parse({id: newWorkflows.length-1});
      }
      else{
        selectedNode.children[0].children[0] = this.tree.parse({id: newWorkflows.length-1});
      }
      this.setState({Workflow: newWorkflows});


    }
    addComment(){
       // add a comment task to the tree-array; possibly consolidate and needs consol.
       let newWorkflows = this.state.Workflow;

       newWorkflows.push(this.commmentProblemTask);

       var selectedNode = this.root.first(function(node){
         return node.model.id == index;
         });

       selectedNode.children[0] = this.tree.parse({id: newWorkflows.length-1});
       this.setState({Workflow: newWorkflows});
    }
    addCritique(){
      return false; //add a critique task to the tree-array; possibly consolidate and needs consol.
    }
    addGrade(){
      return false; //  add grade, possibly (dispute & resolve), consolidate and needs consol.
    }
    removeEdit(parentIndex){
      console.log(parentIndex, this.state.Workflow[parentIndex]);
      var selectedNode = this.root.first(function(node){
        return node.model.id == parentIndex;
        });

      if(selectedNode.hasChildren()){
        let editIndex = selectedNode.children[0].model.id;
        let newWorkflows = this.state.Workflow;
        if(this.state.Workflow[editIndex].TA_type == TASK_TYPES.EDIT){
            newWorkflows[selectedNode.children[0].model.id] = {};
            selectedNode.children[0].drop();
        }
        else{
          newWorkflows[selectedNode.children[0].children[0].model.id] = {};
          selectedNode.children[0].children[0].drop();
        }

        this.setState({
          Workflow: newWorkflows
        });
      }
    }
    removeComment(){
      return false;
    }
    removeGrade(){
      return false;
    }
    removeCritique(){
      return false;
    }


    changeDataCheck(stateField,index){
      let newData = this.state.Workflow;
      if(stateField == "TA_allow_reflection"){
        if(newData[index][stateField][0] != 'none'){
          newData[index][stateField][0] = 'none';
          this.removeEdit(index);
        }
        else{
        newData[index][stateField][0] = 'edit';
        this.addEdit(index);
        }
      }
      else if(stateField == "TA_allow_assessment"){
        if(newData[index][stateField]!= 'none'){
          newData[index][stateField] = 'none';
        }
        else{
          newData[index][stateField] = 'grade';
        }
      }
      else if(stateField == "TA_assignee_constraint"){
        if(newData[index][stateField][1] != 'group'){
          newData[index][stateField][1] = 'group';
        }
        else{
          newData[index][stateField][1] = 'individual';
        }
      }
      else{
        newData[index][stateField] = this.state.Workflow[index][stateField] ? false : true;
      }
      this.setState({
        Workflow: newData
      });
    }

    changeDropdownData(stateField,index, e){
      let newData = this.state.Workflow;
      if(stateField == 'TA_allow_reflection' || stateField == 'TA_assignee_constraint'){
        newData[index][stateField][0] = e.value;
      }
      else{
        newData[index][stateField] = e.value;
      }
      this.setState({
        Workflow: newData
      });
    }

    changeDropdownFieldData(stateField,index,field, e){
      let newData = this.state.Workflow;
        newData[index].TA_fields[field][stateField][0] = e.value;

      this.setState({
        Workflow: newData
      });
    }

    changeFieldName(index, field, e){
      let newData = this.state.Workflow;
      newData[index].TA_fields[field].title= e.target.value;
      newData[index].TA_fields.field_titles[field] = e.target.value;
      this.setState({
        Workflow: newData
      });
    }
    changeFieldCheck(stateField,index,field){
      let newData = this.state.Workflow;
      newData[index].TA_fields[field][stateField] = this.state.Workflow[index].TA_fields[field][stateField] ? false : true;
      this.setState({
        Workflow: newData
      });
    }

    changeFileUpload(workflowIndex,firstIndex,secondIndex,val){
      let newData = this.state.Workflow;
      newData.TA_file_upload[firstIndex][secondIndex] = val;
      this.setState({Workflow: newData});
    }

    changeInputData(stateField,index, e){
      let newData = this.state.Workflow;
      newData[index][stateField] = e.target.value;
      this.setState({
        Workflow: newData
      });
    }

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

    changeNumericFieldData(stateField, index, field, value){
      let newData = this.state.Workflow;
      newData[index].TA_fields[field][stateField] = value;
      this.setState({
        Workflow: newData
      });
    }

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
                                      addEdit={this.addEdit.bind(this)}
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
