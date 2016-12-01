import React from 'react';
import Select from 'react-select';

var moment = require('moment');
import Checkbox from '../shared/checkbox';
import NumberField from '../shared/numberField';
import ToggleSwitch from '../shared/toggleSwitch';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../../server/utils/constants';
import {RadioGroup, Radio} from 'react-radio-group';


class TaskDetailsComponent extends React.Component{

  // PROPS:
  //  - all the methods
  //  - index, TaskActivityData, Opened

    constructor(props){
      super(props);

      this.state = {
          FileUp: false,
          NewTask: true,
          FieldType: "text",
          Tasks: [{
            AtDurationEnd: '',
            WhatIfLate: '',
            Reflection: ['none', null]
          }],
          SimpleGradePointReduction: 0,
          CurrentFieldSelection: null,
          GradingThreshold: ['', ''],
          DefaultFieldForeign: [false], //will be true if want to show Def Content from other tasks
          CurrentTaskFieldSelection: null,
          ShowAssigneeConstraintSections: [false,false,false,false], //same as, in same group as, not in, choose from
          ShowAdvanced: false,
          ShowContent: this.props.isOpen ? true : false
      };
    }

    shouldComponentUpdate(nextProps, nextState){
      // if(this.state !== nextState || this.props.index === this.props.LastTaskChanged){
      //   return true;
      // }
      // return false;
      return true;
    }

    isAssigneeConstraintChecked(constraint,referId){
      if(this.props.TaskActivityData.TA_assignee_constraints[2] === undefined){
        return false;
      }
      if(this.props.TaskActivityData.TA_assignee_constraints[2][constraint] === undefined){
        return false;
      }
      if(this.props.TaskActivityData.TA_assignee_constraints[2][constraint].indexOf(referId) == -1){
        return false;
      }
      else{
        return true;
      }

    }

    showAssigneeSection(key){
      if(this.props.TaskActivityData.TA_assignee_constraints[2][key] === undefined){
        return false;
      }else
      {
        return true;
      }
    }


    render(){
      let title = this.state.NewTask ? (this.props.TaskActivityData.TA_display_name) : (this.props.TaskActivityData.TA_display_name);

      if(!this.state.ShowContent){
        return (
          <div className="section card-1" key={"Mini View of Task " + this.props.index}>
              <h2 className="title" onClick={() => {
                  this.setState({ShowContent: this.state.ShowContent ? false : true,
                                 NewTask: false});
                               }}
                >{title}</h2>
            </div>);
      }
      //for future work, change labels to translatable string variables, keep values the sames
      let fieldTypeValues = [{value:'text',label:'Text'},{value:'numeric',label:'Numeric'},{value:'assessment',label:'Assessment'},{value:'self assessment',label:'Self Assessment'}];
      let assessmentTypeValues = [{value:'grade', label:'Numeric Grade'},{value: 'rating', label: 'Rating'},{value:'pass', label:'Pass/Fail'},{value:'evalutation', label: 'Evalutation by labels'}];
      let onTaskEndValues = [{value:'late', label: 'Late'},{value:'resolved', label: 'Resolved'},{value:'abandon', label: 'Abandon'},{value:'complete', label:'Complete'}];
      let onLateValues = [{value:'keep_same_participant', label:'Keep Same Participant'}, {value:'allocate_new_participant_from_contigency_pool', label: 'Allocate New Participant'}, {value:'allocate_to_instructor', label: 'Allocate to Instructor'},{value: 'allocate_to different_person_in_same_group', label: 'Allocate to Different Group Member'}];
      let reflectionValues = [{value: 'edit', label:'Edit'},{value:'comment', label:'Comment'}];
      let assessmentValues = [{value:'grade',label:'Grade'},{value: 'critique', label: 'Critique'}];
      let assigneeWhoValues = [{value:'student', label:'Student'}, {value:'instructor', label: 'Instructor'}, {value: 'both', label: 'Both Instructor and Students'}];
      let consolidationTypeValues = [{value:'max', label:'Max'},{value:'min',label:'Min'},{value: 'avg', label: 'Average'}, {value:'other', label:'Other'}];
      //display logic

      let taskCreatedList = this.props.getAlreadyCreatedTasks(this.props.index, this.props.workflowIndex);

      let advancedOptionsView = null;
      let simpleGradeOptionsView = null;
      let allowReflectionOptions = null;
      let allowAssesmentOptions = null;
      let whatIfLateView = null;

      //assignee constraint views
      let sameAsOptions = null;
      let inSameGroupAsOptions = null;
      let notInOptions = null;
      let chooseFromOptions = null;
      let assigneeRelations = null;


      let fileUploadOptions= (<div style={{display:'inline-block',
                                          width:'100px'}}></div>);

    /// TA Simple Grade Display Logic

      if(this.props.TaskActivityData.TA_simple_grade != 'none'){
        simpleGradeOptionsView = (<div>
          <label>Reduce this by what % per day late</label><br />
          <NumberField
              value={this.props.TaskActivityData.SimpleGradePointReduction}
              min={0}
              max={100}
              onChange={this.props.changeTASimpleGradePoints.bind(this, this.props.index, this.props.workflowIndex)} />
          <br />
          <label>No Points If Late</label>
            <Checkbox click={this.props.changeTASimpleGradeCheck.bind(this, this.props.index, this.props.workflowIndex)}
                      isClicked={this.props.TaskActivityData.TA_simple_grade == 'off_per_day(100)'}
                      />
          </div>);
      }
      //TA Assignee Contsraint Display Logic


      if(this.props.index != 0){ //if it's the first task, don't show assignee contraint relation part
        if(this.showAssigneeSection('same_as')){
          sameAsOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px'}}>
            {taskCreatedList.map(function(task){
              return (<div>
                <label>{task.label}</label>
                <Checkbox isClicked={this.isAssigneeConstraintChecked('same_as', task.value)}
                   click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'same_as', task.value, this.props.workflowIndex)}
                   />
              </div>)

            },this)
          }
        </div>  );
        }
        if(this.showAssigneeSection('group_with_member')){
          inSameGroupAsOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px'}}>
            {taskCreatedList.map(function(task){
              return (<div>
                <label>{task.label}</label>
                <Checkbox isClicked={this.isAssigneeConstraintChecked('group_with_member', task.value)}
                  click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'group_with_member', task.value, this.props.workflowIndex)} />
              </div>)

            },this)
          }
        </div>  );
        }
        if(this.showAssigneeSection('not')){
          notInOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px',alignContent: 'right'}}>
            {taskCreatedList.map(function(task){
              return (<div className="assignee-contraint-section">

                <label>{task.label}</label>
                <Checkbox isClicked={this.isAssigneeConstraintChecked('not', task.value)}
                  click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'not', task.value, this.props.workflowIndex)} />
              </div>)

            },this)
          }
        </div>  );
        }
        if(this.showAssigneeSection('choose_from')){
          chooseFromOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px'}}>
            {taskCreatedList.map(function(task){
              return (<div>
                <label>{task.label}</label>
                <Checkbox  isClicked={this.isAssigneeConstraintChecked('choose_from', task.value)}
                  click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'choose_from', task.value, this.props.workflowIndex)} />
              </div>)

            },this)
          }
        </div>);
        }

        assigneeRelations = (<div className="inner">
          <label>Should this assignee have a specific relation to an assignee of another task in this problem</label>
          <br />
          <label>None</label>
          <Checkbox click={this.props.checkAssigneeConstraints.bind(this, this.props.index, 'none', this.props.workflowIndex) }
            isClicked={ Object.keys(this.props.TaskActivityData.TA_assignee_constraints[2]).length === 0 ? true : false }
            style={{marginRight: '8px'}}/>
          <label>New to Problem</label>
          <Checkbox click={this.props.checkAssigneeConstraints.bind(this, this.props.index, 'not_in_workflow_instance', this.props.workflowIndex)}
              isClicked={this.props.TaskActivityData.TA_assignee_constraints[2]['not_in_workflow_instance'] ? true : false}/>
          <label>Same as</label>
          <Checkbox click={  this.props.checkAssigneeConstraints.bind(this.props.index, 'same_as', this.props.workflowIndex)}
            isClicked={this.props.TaskActivityData.TA_assignee_constraints[2]['same_as'] ? true : false }
              style={{marginRight: '8px'}}/>
          <label>In same group as</label>
          <Checkbox click={this.props.checkAssigneeConstraints.bind(this.props.index, 'group_with_member', this.props.workflowIndex)}
            isClicked={this.props.TaskActivityData.TA_assignee_constraints[2]['group_with_member'] ? true : false }
            style={{marginRight: '8px'}}/>
          <label>Not in</label>
          <Checkbox click={this.props.checkAssigneeConstraints.bind(this.props.index, 'not', this.props.workflowIndex)}
             isClicked={this.props.TaskActivityData.TA_assignee_constraints[2]['not'] ? true : false }
              style={{marginRight: '8px'}} />
          <label>Choose from </label>
          <Checkbox click={this.props.checkAssigneeConstraints.bind(this.props.index, 'choose_from', this.props.workflowIndex)}
            isClicked={this.props.TaskActivityData.TA_assignee_constraints[2]['choose_from'] ? true : false }
                />
              <br />
          {sameAsOptions}
          {inSameGroupAsOptions}
          {notInOptions}
          {chooseFromOptions}
        </div>)

      }
      // TA File Upload Display Logic
      if(this.state.FileUp){
        fileUploadOptions = (
          <div style={{display: "inline-block"}}>
            <div className="inner"  >
              <label> How many required files</label> <br />
              <NumberField
                  min={0}
                  max={10}
                  onChange={this.props.changeFileUpload.bind(this, this.props.index,0,0, this.props.workflowIndex)}
                  value={this.props.TaskActivityData.TA_file_upload[0][0]} />
            </div>
            <div className="inner"  >
              <label> Maximum number of optional files</label> <br />
              <NumberField
                  min={0}
                  max={10}
                  onChange={this.props.changeFileUpload.bind(this, this.props.index,1,0, this.props.workflowIndex)}
                  value={this.props.TaskActivityData.TA_file_upload[1][0]} />

            </div>
          </div>);
      }

      //TA At Duration End Display Logic to show TA What if Late
      if(this.props.TaskActivityData.TA_at_duration_end == 'late'){
        whatIfLateView = (<div>
          <label> What happens if late</label>
        <Select options={onLateValues}
          onChange={ this.props.changeDropdownData.bind(this,'TA_what_if_late',this.props.index, this.props.workflowIndex)}
          value={this.props.TaskActivityData.TA_what_if_late}
          clearable={false}
          searchable={false}
          autoBlur={true}
           />
          </div>
        )
      }

      //TA Allow Assessment Display Logic
      if(this.props.TaskActivityData.TA_allow_assessment != 'none'){
        let consolidateOptions = (
          <div>
          <label>Grading Threshold</label>
        <br />
          <RadioGroup
            selectedValue={this.state.GradingThreshold[1]}
            onChange={ (val) =>{
              this.props.changeRadioData('TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex, val);
              let newGrades = this.state.GradingThreshold;
              newGrades[1] = val;
              this.setState({GradingThreshold: newGrades});
              }
            }
            >
            <label> Points
              <Radio value="points" />
            </label>
            <label> Percent
              <Radio value="percent" />
            </label>

          </RadioGroup>
        <br />
        <NumberField
            value={2}
            min={0}
            max={100}
            onChange={this.props.changeNumericData.bind(this, 'TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex)}
            size={6} />
          <br />
        <label>To be consolidated, the grades should be: </label>
        <Select options={consolidationTypeValues}
          value={this.props.getConsolidateValue(this.props.index, this.props.workflowIndex, true)}
          onChange={this.props.changeDropdownData.bind(this, 'TA_function_type_Assess', this.props.index, this.props.workflowIndex)}
          clearable={false}
          searchable={false}
          />
      </div>);

        let showConsol= this.props.getAssessNumberofParticipants(this.props.index, this.props.workflowIndex) > 1 ? (

          <div>
            <label>Should the assessments be consolidated</label>
            <Checkbox
               click={this.props.changeDataCheck.bind(this, "Assess_Consolidate", this.props.index, this.props.workflowIndex)}
               isClicked={this.props.TaskActivityData.AllowConsolidations[1]}
               />
            <br />
            {this.props.TaskActivityData.AllowConsolidations[1] ? consolidateOptions : null}
          </div>
            )
             : null;


        let numberOfAssessView = null;
        let assessConstraint = this.props.getAssigneeInChild(false, this.props.index, this.props.workflowIndex)
        if(assessConstraint == 'student' || assessConstraint == 'both'){
          numberOfAssessView = (
          <div>
            <br />
            <label>Number of Assessors</label>
            <br />
            <NumberField
              value={this.props.getAssessNumberofParticipants(this.props.index, this.props.workflowIndex)}
              min={1}
              max={20}
              onChange = {this.props.setAssessNumberofParticipants.bind(this, this.props.index, this.props.workflowIndex)} />
            <br />
            {showConsol}
          </div>
          );
        }

        let showDispute = (<div>
          <label> Can students dispute this assessment </label>
          <Checkbox click={this.props.changeDataCheck.bind(this, "Assess_Dispute", this.props.index, this.props.workflowIndex)}
            />
          </div>);
          {/* Come back to this isClicked*/}
        allowAssesmentOptions = (
          <div>
          <Select options={assessmentValues}
            onChange={this.props.changeDropdownData.bind(this,'TA_allow_assessment',this.props.index, this.props.workflowIndex)}
            value={this.props.TaskActivityData.TA_allow_assessment}
            clearable={false}
            searchable={false}/>
          <label>Who can assess</label>
          <br />
            <Select options={assigneeWhoValues}
                      value={this.props.getAssigneeInChild(false, this.props.index, this.props.workflowIndex)}
                      onChange={this.props.changeAssigneeInChild.bind(this,false, this.props.index, this.props.workflowIndex)}
                      clearable={false}
                      searchable={false}/>
            {numberOfAssessView}
            <br />
            {showDispute}
          </div>
        );
      }

      // TA Allow reflection Display Logic
      if(this.props.TaskActivityData.TA_allow_reflection[0] != 'none'){

        let consolidateOptions = (
          <div>
          <label>Grading Threshold</label>
          <br />
          <RadioGroup
            selectedValue={this.state.GradingThreshold[0]}
            onChange={ (val) =>{
              this.props.changeRadioData('TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex, val);
              let newGrades = this.state.GradingThreshold;
              newGrades[0] = val;
              this.setState({GradingThreshold: newGrades});
              }
            }
            >
            <label> Points
              <Radio value="points" />
            </label>
            <label> Percent
              <Radio value="percent" />
            </label>

          </RadioGroup>
        <br />
        <NumberField
            value={2}
            min={0}
            max={100}
            onChange={this.props.changeNumericData.bind(this, 'TA_trigger_consolidation_threshold_reflect', this.props.index, this.props.workflowIndex)}
            size={6} />
          <br />
        <label>To be consolidated, the grades should be: </label>
        <Select options={consolidationTypeValues}
           clearable={false}
           searchable={false}
           value={this.props.getConsolidateValue(this.props.index, this.props.workflowIndex, false)}
           onChange={this.props.changeDropdownData.bind(this, 'TA_function_type_Reflect', this.props.index,this.props.workflowIndex)}
           />
      </div>);



        let showConsol= this.props.getReflectNumberofParticipants(this.props.index, this.props.workflowIndex) > 1 ? (
          <div>
          <label>Should the reflections be consolidated</label>
        <Checkbox click={this.props.changeDataCheck.bind(this, "Reflect_Consolidate", this.props.index, this.props.workflowIndex)}
          isClicked={this.props.TaskActivityData.AllowConsolidations[0]}
          />
        <br />
        {this.props.TaskActivityData.AllowConsolidations[0] ? consolidateOptions : null}
        </div>
        ) : null;

        let showDispute = (<div>
          <label> Can students dispute this reflection </label>
          <Checkbox click={this.props.changeDataCheck.bind(this, "Reflect_Dispute", this.props.index, this.props.workflowIndex)}/>
          </div>);{/*Also come back to this &&&&&&&&&&&&&&&&&&&&#%$#%#$%54$%%#$$%+!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}

        let numberOfReflectorsView = null;
        let reflectConstr = this.props.getAssigneeInChild(true, this.props.index, this.props.workflowIndex);

        if(reflectConstr == 'student' || reflectConstr == 'both'){
          numberOfReflectorsView = (<div>
            <br />
            <label>Number of Students</label>
            <br />
            <NumberField
                value={this.props.getReflectNumberofParticipants(this.props.index, this.props.workflowIndex)}
                min={1}
                max={20}
                onChange = {this.props.setReflectNumberofParticipants.bind(this, this.props.index, this.props.workflowIndex)}
                />
              <br />
              {showConsol}
          </div>)
        }

        allowReflectionOptions = (<div>
          <Select options={reflectionValues}
            onChange={this.props.changeDropdownData.bind(this,'TA_allow_reflection',this.props.index, this.props.workflowIndex)}
            value={this.props.TaskActivityData.TA_allow_reflection[0]}
            clearable={false}
            searchable={false}
            />
          <label>Who will reflect</label><br />
            <Select   options={assigneeWhoValues}
                      value={this.props.getAssigneeInChild(true, this.props.index, this.props.workflowIndex)}
                      onChange={this.props.changeAssigneeInChild.bind(this, true, this.props.index, this.props.workflowIndex)}
                      clearable={false}
                      searchable={false}/>

                    {numberOfReflectorsView}
            <br />
            {showDispute}
        </div>);
      }


      ///# Advanced Options View Logic #//////////////

      if(this.state.ShowAdvanced){
        advancedOptionsView = (
          <div className="section-divider">
            <br />
            <div className="inner">
                <label>Should this task end at a certain time</label>
                <br />
                <RadioGroup
                  selectedValue={this.props.TaskActivityData.TA_due_type[0]}
                  onChange={this.props.changeRadioData.bind(this,'TA_due_type', this.props.index, this.props.workflowIndex)} >
                  <label>
                    <Radio value="duration" />
                    Expire After
                  </label>
                  <label><Radio value="specific time" />End at this time</label>

                </RadioGroup>
                <br />
                <NumberField
                    value={this.props.TaskActivityData.TA_due_type[1] / 1440 }
                    min={0}
                    max={200}
                    onChange={this.props.changeNumericData.bind(this,'TA_due_type',this.props.index, this.props.workflowIndex)}
                    />
            </div>


            <div className="inner">
              <label>Delay before starting task</label>
              <br />
              <RadioGroup selectedValue={this.props.TaskActivityData.StartDelay}
                          onChange={this.props.changeRadioData.bind(this, 'StartDelay', this.props.index, this.props.workflowIndex)}
                          >
                <label><Radio value={false} ></Radio>Start when prior task is complete</label><br/>
                <label><Radio value={true} ></Radio>Start after prior task ends by</label>
              </RadioGroup>
              <NumberField  value={this.props.TaskActivityData.TA_start_delay}
                  min={0}
                  max={60}
                  onChange={this.props.changeNumericData.bind(this,'TA_start_delay',this.props.index, this.props.workflowIndex)}
                />
            </div>

            <div className= "inner">
              <label>Does everyone get the same problem</label> <br />
              <RadioGroup selectedValue={this.props.TaskActivityData.TA_one_or_separate} onChange={
                  this.props.changeRadioData.bind(this,'TA_one_or_separate', this.props.index, this.props.workflowIndex)
                }>
                <label><Radio value={false}/> No</label>
                <label><Radio value={true} /> Yes</label>
              </RadioGroup>
            </div>
            <br/>
            <br />
            <div className="inner" >
              <label>What happens when the task ends</label> <br/>
              <Select value={this.props.TaskActivityData.TA_at_duration_end}
                options={onTaskEndValues}
                onChange={this.props.changeDropdownData.bind(this, 'TA_at_duration_end', this.props.index, this.props.workflowIndex)}
                clearable={false}
                searchable={false}
                 />
              {whatIfLateView}
              </div>
              <div className="inner">
                <label>Award points just for doing the task on time</label>

                <Checkbox click={this.props.changeSimpleGradeCheck.bind(this, this.props.index, this.props.workflowIndex)}
                  isClicked={this.props.TaskActivityData.TA_simple_grade != 'none'} />
                <br />
                {simpleGradeOptionsView}
              </div>

              <div className="inner">
              </div>

              <br />
              <br />
              <div className="inner">
                <label>Allow a reflection of this task</label>
                <Checkbox click={this.props.changeDataCheck.bind(this, "TA_allow_reflection", this.props.index, this.props.workflowIndex)}
                  isClicked={this.props.TaskActivityData.TA_allow_reflection[0] != 'none'}/>
              {allowReflectionOptions}
              </div>

              <div className="inner">
                  <label>Allow an assessment of this task</label>
                    <Checkbox click={this.props.changeDataCheck.bind(this,'TA_allow_assessment', this.props.index, this.props.workflowIndex)}
                       isClicked={this.props.TaskActivityData.TA_allow_assessment != 'none'}/>
                  {allowAssesmentOptions}
              </div>

              <div className="inner">
                <label>Allow a revision of this task</label>
                <Checkbox click={this.props.changeDataCheck.bind(this,"TA_allow_revisions",this.props.index, this.props.workflowIndex) }
                  />

                {/*
                  *Also come back to this
                  *
                  */}
              </div>

              <br />
              <br />

              <div className="inner">
                  <label>Assignee Constraints</label>
                  <br />
                  <label>Who can do this task</label>
                  <br />
                  <Select options={assigneeWhoValues}
                          value={this.props.TaskActivityData.TA_assignee_constraints[0]}
                          onChange={this.props.changeDropdownData.bind(this,'TA_assignee_constraints', this.props.index, this.props.workflowIndex)}
                          clearable={false}
                          searchable={false}
                            />

                  <label>Will this be a group task</label>
                  <Checkbox click={this.props.changeDataCheck.bind(this,'TA_assignee_constraints', this.props.index, this.props.workflowIndex)}
                    isClicked = {this.props.TaskActivityData.TA_assignee_constraints[1] == 'group'}/>
              </div>

              {assigneeRelations}

              <br />
              <br />

              <div className="inner">
                <label>Does this lead to a new problem?</label>
                <Checkbox click={this.props.changeDataCheck.bind(this,'TA_leads_to_new_problem', this.props.index, this.props.workflowIndex)}
                  isClicked={this.props.TaskActivityData.TA_leads_to_new_problem} />
              </div>

              <div className="inner">
                <label>Does this lead to a new solution?</label>
                <Checkbox click={this.props.changeDataCheck.bind(this,'TA_leads_to_new_solution', this.props.index, this.props.workflowIndex)}
                   isClicked={this.props.TaskActivityData.TA_leads_to_new_solution} />
              </div>

            </div>

        );
      }



      let inputFieldsView = this.props.TaskActivityData.TA_fields.field_titles.map(function(field, index) {
          let justificationView = null; //justification textbox for the field
          let fieldTypeOptions = null; //options that change on Field Type dropbox selection
          let assessmentTypeView = null; //options that change on assessment type selection
          let defaultContentView = null;
          let showDefaultFromOthers = taskCreatedList.length > 0 ? true : false;
          let defaultContentButton = null;

          if (this.props.TaskActivityData.TA_fields[index].requires_justification) {
              justificationView = (
                  <div className="inner block" key={index + 200}>
                      <label>Field Justification Instructions</label>
                      <textarea className="big-text-field" placeholder={'Type insructions for the justification here...'} value={this.props.TaskActivityData.TA_fields[index].justification_instructions} onChange={this.props.changeInputFieldData.bind(this, 'justification_instructions', this.props.index, index, this.props.workflowIndex)}></textarea>
                  </div>
              )
          }

          if (this.props.TaskActivityData.TA_fields[index].field_type == "numeric") {
              fieldTypeOptions = (
                  <div>
                      <label>Min</label>
                      <NumberField min={0} max={100} value={this.props.TaskActivityData.TA_fields[index].numeric_min} onChange={this.props.changeNumericFieldData.bind(this, 'numeric_min', this.props.index, index, this.props.workflowIndex)}/>
                      <br/>
                      <label>Max</label>
                      <NumberField value={this.props.TaskActivityData.TA_fields[index].numeric_max} min={0} max={100} onChange={this.props.changeNumericFieldData.bind(this, "numeric_max", this.props.index, index, this.props.workflowIndex)}/>
                  </div>
              );

          } else if (this.props.TaskActivityData.TA_fields[index].field_type == "assessment" || this.props.TaskActivityData.TA_fields[index].field_type == "self assessment") {
              if (this.props.TaskActivityData.TA_fields[index].assessment_type == 'grade') {
                  assessmentTypeView = (
                      <div>
                          <label>Min</label>
                          <NumberField min={0} max={100} value={this.props.TaskActivityData.TA_fields[index].numeric_min} onChange={this.props.changeNumericFieldData.bind(this, 'numeric_min', this.props.index, index, this.props.workflowIndex)}/>
                          <label>Max</label>
                          <NumberField value={this.props.TaskActivityData.TA_fields[index].numeric_max} min={0} max={100} onChange={this.props.changeNumericFieldData.bind(this, "numeric_max", this.props.index, index, this.props.workflowIndex)}/>
                      </div>
                  );
              }

              fieldTypeOptions = (
                  <div>

                      <label>Assessment Type</label>
                      <br/>

                      <Select key={index + 300}
                        options={assessmentTypeValues}
                        onChange={this.props.changeDropdownFieldData.bind(this, 'assessment_type', this.props.index, index, this.props.workflowIndex)}
                        value={this.props.TaskActivityData.TA_fields[index].assessment_type}
                        searchable={false}
                        clearable={false}
                        />
                      <br/>
                      {assessmentTypeView}
                  </div>
              );

          }
          // Default Content from Other Tasks Logic
          if(showDefaultFromOthers){
            let fieldSelectionList = this.props.getTaskFields(this.state.CurrentTaskFieldSelection,this.props.workflowIndex).map(function(field){
                return (<label>
                  {field.label} <Radio value={field.value} />
                  </label>
                );
              });
            let fieldSelection = (
              <RadioGroup selectedValue={this.state.CurrentFieldSelection} key={"taskFieldDefault" + 1} onChange={(value)=>{
                  this.setState({
                    CurrentFieldSelection: value
                  });
                   this.props.setDefaultField(1, index, this.props.index, this.props.workflowIndex,value)
              }} >
              {fieldSelectionList}
              </RadioGroup>
            );

            let defaultContentWrapper = (<div>
              <RadioGroup key={"taskFieldDefault" + 2} selectedValue={this.state.CurrentTaskFieldSelection} onChange={(value)=>{
                  this.setState({
                    CurrentTaskFieldSelection: value
                  });
                  this.props.setDefaultField(0, index, this.props.index, this.props.workflowIndex,value)
              }}>
                {
                    taskCreatedList.map(function(task){
                    return (<label> {task.label}<Radio value={task.value}/></label>);
                      }, this)
                }

              </RadioGroup>

              </div>
            );
            if(this.state.DefaultFieldForeign[index]){
              defaultContentView = (
                <div className="inner block">
                    <label>Default content from other task</label>
                    {defaultContentWrapper}
                    {fieldSelection}
                </div>
              );
            }
            else{
              defaultContentView = (
                <div className="inner block">
                    <label>Default content for the field</label>
                    <textarea className="big-text-field" placeholder="Default content for the field..." onChange={this.props.changeInputFieldData.bind(this, 'default_content', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].default_content[0]}></textarea>
                </div>
              );
            }
            defaultContentButton = (<div style={{display: 'inline'}}><label>Get the data from another task instead?
              <Checkbox isClicked={this.state.DefaultFieldForeign[index]}
                        click={()=>{
                          let newData = this.state.DefaultFieldForeign;
                          newData[index] = !newData[index];
                          this.setState({
                            DefaultFieldForeign: newData
                          })
                        }}
                        />
            </label>
          </div>);
          }
          else{
            defaultContentView = (
              <div className="inner block">
                  <label>Default content for the field</label>
                  <textarea className="big-text-field" placeholder="Default content for the field..." onChange={this.props.changeInputFieldData.bind(this, 'default_content', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].default_content[0]}></textarea>
              </div>
            );
          }



          return (
              <div className="section-divider" key={"Task " + this.props.index +" of Workflow ", this.props.workflowIndex, " Field " + index}>
                  <h3 className="subheading">Input Fields</h3>

                  <div className="inner">
                      <label>Field Name</label>
                      <br/>
                      <input type="text" placeholder="Field Name" value={this.props.TaskActivityData.TA_fields[index].title} onChange={this.props.changeFieldName.bind(this, this.props.index, index, this.props.workflowIndex)}></input>
                  </div>

                  <div className="inner">
                      <label>
                          Show this name?
                      </label><br/>
                      <Checkbox isClicked={this.props.TaskActivityData.TA_fields[index].show_title} click={this.props.changeFieldCheck.bind(this, "show_title", this.props.index, index, this.props.workflowIndex)}/>
                  </div>

                  <div className="inner">
                      <label>Field Type</label>
                      <br/>

                      <Select key={index}
                        options={fieldTypeValues}
                        onChange={this.props.changeDropdownFieldData.bind(this, 'field_type', this.props.index, index, this.props.workflowIndex)}
                        value={this.props.TaskActivityData.TA_fields[index].field_type}
                        clearable={false}
                        searchable={false}
                        />
                      <br/> {fieldTypeOptions}
                  </div>

                  <div className="inner">
                      <label>Requires Justification ?</label><br />
                      <Checkbox click={this.props.changeFieldCheck.bind(this, 'requires_justification', this.props.index, index, this.props.workflowIndex)}
                        isClicked={this.props.TaskActivityData.TA_fields[index].requires_justification}/>
                  </div>

                  <div className="inner block">
                      <label >Field Instructions (optional)</label>
                      <textarea className="big-text-field" placeholder="Type the instructions here..." onChange={this.props.changeInputFieldData.bind(this, 'instructions', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].instructions}></textarea>
                  </div>

                  <div className="inner block">
                      <label>Field Rubric</label>
                      <textarea className="big-text-field" placeholder="Type the rubric here..." onChange={this.props.changeInputFieldData.bind(this, 'rubric', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].rubric}></textarea>
                  </div>

                  {justificationView}
                  <br />
                  {defaultContentView}
                  {defaultContentButton}


                  <br/>
                  <br/>
              </div>
          );
      }, this);



      return (
        <div  key={"Main View of Task " + this.props.index + " in " + this.props.workflowIndex} className="section card-1">
            <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true,
                                                                 NewTask: false});}} >{title}</h2>
              <div className="section-content">{/* this decides whether to hide the content or not. task-hiding displays nothing*/}
                <div className="section-divider">
                  <div className="inner">
                    <label>Display name</label>
                    <br />
                    <input type="text" placeholder="Display Name "  value={this.props.TaskActivityData.TA_display_name}
                            onChange={this.props.changeInputData.bind(this,'TA_display_name', this.props.index, this.props.workflowIndex)} ></input><br />
                  </div>
                  <div className="inner">
                    <label>Are any file uploads required?</label>
                    <Checkbox isClicked={this.state.FileUp} click={ ()=>{
                        this.setState({
                          FileUp: this.state.FileUp ? false: true
                          });
                        }}  />
                  </div>
                  {fileUploadOptions}

                  <br />
                  <div className="inner block">
                    <label>Task Instructions</label>
                    <textarea className="big-text-field" placeholder="Type the instructions here..."
                              onChange={this.props.changeInputData.bind(this,'TA_overall_instructions', this.props.index, this.props.workflowIndex)}
                              value={this.props.TaskActivityData.TA_overall_instructions}
                              ></textarea>
                    </div>
                    <br />
                    <div className="inner block">
                      <label>Task Rubric</label>
                      <textarea className="big-text-field" placeholder="Type the rubric here..."
                                onChange={this.props.changeInputData.bind(this,'TA_overall_rubric', this.props.index, this.props.workflowIndex)}
                                value={this.props.TaskActivityData.TA_overall_rubric}
                                ></textarea>
                      </div>
                </div>

                {inputFieldsView}


                <div className="section-divider">
                  <div className="inner block" style={{alignContent:'right'}}>
                    <button type="button" className="divider" onClick={()=>{
                        this.props.addFieldButton(this.props.index, this.props.workflowIndex)
                        let newDefFields = this.state.DefaultFieldForeign;
                        newDefFields.push(false);
                        this.setState({
                          DefaultFieldForeign: newDefFields
                        });
                        }
                      }

                        >
                        <i className="fa fa-check"></i>
                        Add another field
                    </button>

                    <br />
                    <br />
                    <br />
                    <br />
                    <label style={{display: 'inline-block', float:'right'}}>Show Advanced Options?</label>
                    <br />
                    <ToggleSwitch click={ ()=> {
                        this.setState({ShowAdvanced : this.state.ShowAdvanced ? false : true});
                      }} />
                  </div>
                </div>

                {advancedOptionsView}

                  <br />

              </div>
        </div>
      );
    }
}

export default TaskDetailsComponent;
