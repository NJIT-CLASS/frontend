import React from 'react';
import NumericInput from 'react-numeric-input';
import Dropdown from 'react-dropdown';
var moment = require('moment');
import Checkbox from '../shared/checkbox';
import ToggleSwitch from './toggleSwitch';
var CheckBoxList = require('react-checkbox-list');
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
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
          ShowAssigneeConstraintSections: [false,false,false,false], //same as, in same group as, not in, choose from
          ShowAdvanced: false,
          ShowContent: this.props.isOpen ? true : false
      };
    }






    render(){
      let style={marginRight: "10px",
                marginLeft:'10px'};
      let instyle = {display: "inline-block"};
      //for future work, change labels to translatable string variables, keep values the sames
      let fieldTypeValues = [{value:'text',label:'Text'},{value:'numeric',label:'Numeric'},{value:'assessment',label:'Assessment'},{value:'self assessment',label:'Self Assessment'}];
      let assessmentTypeValues = [{value:'grade', label:'Numeric Grade'},{value: 'rating', label: 'Rating'},{value:'pass', label:'Pass/Fail'},{value:'evalutation', label: 'Evalutation by labels'}];
      let onTaskEndValues = [{value:'late', label: "Late"},{value:'resolved', label: 'Resolved'},{value:'abandon', label: 'Abandon'},{value:'complete', label:'Complete'}];
      let onLateValues = [{value:'Keep same participant', label:'Keep Same Participant'}, {value:'Allocate new participant', label: 'Allocate New Participant'}, {value:'Allocate to instructor', label: 'Allocate to Instructor'},{value: 'Allocate to different group member', label: 'Allocate to Different Group Member'}, {value: 'Consider resolved', label: 'Consider Resolved'}];
      let reflectionValues = [{value: 'edit', label:'Edit'},{value:'comment', label:'Comment'}];
      let assessmentValues = [{value:'grade',label:'Grade'},{value: 'critique', label: 'Critique'}];
      let assigneeWhoValues = [{value:'student', label:'Student'}, {value:'instructor', label: 'Instructor'}];
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


      let fileUploadOptions= (<div style={{display:'inline-block',
                                          width:'100px'}}></div>);

      if(this.props.TaskActivityData.TA_allow_assessment != 'none'){
        let showConsol= this.props.getAssessNumberofParticipants(this.props.index, this.props.workflowIndex) > 1 ? (
          <div>
            <label>Should the assessments be consolidated</label>
            <Checkbox click={this.props.changeDataCheck.bind(this, "Assess_Consolidate", this.props.index, this.props.workflowIndex)}/>
            <br />
            <label>Grading Threshold</label>
            <br />
            <label>Points</label><input type="radio"></input>
            <label>Percentage</label><input type="radio"></input>
            <br />
            <NumericInput
                value={2}
                min={0}
                size={6} />
              <br />
            <label>To be consolidated, the grade should be: </label>
            <Dropdown options={['max','sum','average']} />
          </div>) : null;

        let showDispute = (<div>
          <label> Can students dispute this reflection </label>
          <Checkbox click={this.props.changeDataCheck.bind(this, "Assess_Dispute", this.props.index, this.props.workflowIndex)}/>
          </div>);

        allowAssesmentOptions = (<div>
          <Dropdown options={assessmentValues}  onChange={this.props.changeDropdownData.bind(this,'TA_allow_assessment',this.props.index, this.props.workflowIndex)} selectedValue={this.props.TaskActivityData.TA_allow_assessment} />
          <label>Who can assess</label>
          <br />
          <label>Students</label><Checkbox />
          <label>Instructors</label><Checkbox />
          <br />
          <label>Number of Assessors</label>
          <br />
          <NumericInput
            value={this.props.getAssessNumberofParticipants(this.props.index, this.props.workflowIndex)}
            min={1}
            size={6}
            onChange = {this.props.setAssessNumberofParticipants.bind(this, this.props.index, this.props.workflowIndex)} />
            <br />
            {showConsol}
            <br />
            {showDispute}
        </div>)
      }

      if(this.props.TaskActivityData.TA_simple_grade != 'none'){
        simpleGradeOptionsView = (<div>
          <label>Reduce this by what % per day late</label><br />
          <NumericInput
              value={this.props.TaskActivityData.SimpleGradePointReduction}
              min={0}
              size={6}
              onChange={this.props.changeTASimpleGradePoints.bind(this, this.props.index, this.props.workflowIndex)} />
          <br />
          <label>No Points If Late</label>
            <Checkbox click={this.props.changeTASimpleGradeCheck.bind(this, this.props.index, this.props.workflowIndex)} />
          </div>);
      }

      if(this.state.ShowAssigneeConstraintSections[0]){
        sameAsOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px'}}>
          {taskCreatedList.map(function(task){
            return (<div>
              <label>{task.label}</label>
              <Checkbox click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'same_as', task.value, this.props.workflowIndex)} />
            </div>)

          },this)
        }
      </div>  );
      }
      if(this.state.ShowAssigneeConstraintSections[1]){
        inSameGroupAsOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px'}}>
          {taskCreatedList.map(function(task){
            return (<div>
              <label>{task.label}</label>
              <Checkbox click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'group_with_member', task.value, this.props.workflowIndex)} />
            </div>)

          },this)
        }
      </div>  );
      }
      if(this.state.ShowAssigneeConstraintSections[2]){
        notInOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px',alignContent: 'right'}}>
          {taskCreatedList.map(function(task){
            return (<div>
              <label>{task.label}</label>
              <Checkbox click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'not', task.value, this.props.workflowIndex)} />
            </div>)

          },this)
        }
      </div>  );
      }
      if(this.state.ShowAssigneeConstraintSections[3]){
        chooseFromOptions = (<div className="checkbox-group inner" style={{marginLeft: '8px'}}>
          {taskCreatedList.map(function(task){
            return (<div>
              <label>{task.label}</label>
              <Checkbox click={this.props.checkAssigneeConstraintTasks.bind(this, this.props.index, 'choose_from', task.value, this.props.workflowIndex)} />
            </div>)

          },this)
        }
      </div>);
      }


      if(this.state.FileUp){
        fileUploadOptions = (
          <div style={{display: "inline-block"}}>
            <div className="inner" style={instyle}>
              <label> How many required files</label> <br />
              <NumericInput
                  min={0}
                  size={6}
                  onChange={this.props.changeFileUpload.bind(this, this.props.index,0,0, this.props.workflowIndex)}
                  value={this.props.TaskActivityData.TA_file_upload[0][0]} />
            </div>
            <div className="inner" style={instyle}>
              <label> Maximum number of optional files</label> <br />
              <NumericInput
                  min={0}
                  size={6}
                  onChange={this.props.changeFileUpload.bind(this, this.props.index,1,0, this.props.workflowIndex)}
                  value={this.props.TaskActivityData.TA_file_upload[1][0]} />

            </div>
          </div>);
      }

      if(this.props.TaskActivityData.TA_at_duration_end == 'late'){
        whatIfLateView = (<div>
          <label> What happens if late</label>
        <Dropdown options={onLateValues}
          onChange={ this.props.changeDropdownData.bind(this,'TA_what_if_late',this.props.index, this.props.workflowIndex)}
            value={this.props.TaskActivityData.TA_what_if_late} />
          </div>
        )
      }

      if(this.props.TaskActivityData.TA_allow_reflection[0] != 'none'){

        let showConsol= this.props.getReflectNumberofParticipants(this.props.index, this.props.workflowIndex) > 1 ? (
          <div>
          <label>Should the reflections be consolidated</label>
        <Checkbox click={this.props.changeDataCheck.bind(this, "Reflect_Consolidate", this.props.index, this.props.workflowIndex)}/></div>) : null;

        let showDispute = (<div>
          <label> Can students dispute this reflection </label>
          <Checkbox click={this.props.changeDataCheck.bind(this, "Reflect_Dispute", this.props.index, this.props.workflowIndex)}/>
          </div>);

        allowReflectionOptions = (<div>

          <Dropdown options={reflectionValues} onChange={this.props.changeDropdownData.bind(this,'TA_allow_reflection',this.props.index, this.props.workflowIndex)} selectedValue={this.props.TaskActivityData.TA_allow_reflection[0]}/>
          <label>Who can reflect</label><br />
          <label>Students</label><Checkbox />
          <label>Instructors</label><Checkbox />
          <br />
          <label>Number of Editors</label>
          <br />
          <NumericInput
              value={this.props.getReflectNumberofParticipants(this.props.index, this.props.workflowIndex)}
              min={1}
              size={6}
              onChange = {this.props.setReflectNumberofParticipants.bind(this, this.props.index, this.props.workflowIndex)}
              />
            <br />
            {showConsol}
            <br />
            {showDispute}
        </div>);
      }



      let inputFieldsView = this.props.TaskActivityData.TA_fields.field_titles.map(function(field, index){
        let justificationView = null; //justification textbox for the field
        let fieldTypeOptions = null; //options that change on Field Type dropbox selection
        let assessmentTypeView = null; //options that change on assessment type selection

        if(this.props.TaskActivityData.TA_fields[index].requires_justification){
          justificationView = (
          <div className = "inner block" key={index + 200}>
            <label>Field Justification Instructions</label>
            <textarea className="big-text-field"
              value={this.props.TaskActivityData.TA_fields[index].justification_instructions}
              onChange={this.props.changeInputFieldData.bind(this,'justification_instructions',this.props.index, index, this.props.workflowIndex)}></textarea>
          </div>)

        }

        if(this.props.TaskActivityData.TA_fields[index].field_type == "numeric"){
          fieldTypeOptions = (<div>
            <label>Min</label>
            <NumericInput

                min={0}
                size={6}
                value={this.props.TaskActivityData.TA_fields[index].numeric_min}

                onChange={this.props.changeNumericFieldData.bind(this,'numeric_min', this.props.index, index, this.props.workflowIndex)
                }
                />
              <br />
              <label>Max</label>
              <NumericInput
                  value={this.props.TaskActivityData.TA_fields[index].numeric_max}
                  min={0}
                  size={6}
                  onChange={ this.props.changeNumericFieldData.bind(this,"numeric_max",this.props.index,index, this.props.workflowIndex)}
                  />
              </div>);


        }

        else if(this.props.TaskActivityData.TA_fields[index].field_type == "assessment" || this.props.TaskActivityData.TA_fields[index].field_type == "self assessment"){
          if(this.props.TaskActivityData.TA_fields[index].assessment_type == 'grade'){
            assessmentTypeView  = (<div>
              <label>Min</label>
              <NumericInput

                  min={0}
                  size={6}
                  value={this.props.TaskActivityData.TA_fields[index].numeric_min}

                  onChange={this.props.changeNumericFieldData.bind(this,'numeric_min', this.props.index, index, this.props.workflowIndex)
                  }
                  />
                <label>Max</label>
                <NumericInput
                    value={this.props.TaskActivityData.TA_fields[index].numeric_max}
                    min={0}
                    size={6}
                    onChange={ this.props.changeNumericFieldData.bind(this,"numeric_max",this.props.index,index, this.props.workflowIndex )}
                    />
                </div>);
          }


          fieldTypeOptions = (<div>

            <label>Assessment Type</label> <br/>

              <Dropdown key={index+300}
                options={assessmentTypeValues}
                onChange={this.props.changeDropdownFieldData.bind(this, 'assessment_type', this.props.index, index, this.props.workflowIndex)}
                selectedValue={this.props.TaskActivityData.TA_fields[index].assessment_type} />

              <br />
              {assessmentTypeView}
          </div>);



        }

        return (<div className="section-divider">
                  <h3 className="subheading">Input Fields</h3>

                  <div className="inner" >
                    <label>Field Name</label> <br />
                    <input type="text" style={style} placeholder="Field Name"
                      value={this.props.TaskActivityData.TA_fields[index].title}
                      onChange={this.props.changeFieldName.bind(this,this.props.index,index, this.props.workflowIndex)}></input>
                  </div>

                  <div className="inner">
                    <label>Field Type</label> <br />

                    <Dropdown key={index}
                      options={fieldTypeValues}
                      onChange={this.props.changeDropdownFieldData.bind(this, 'field_type', this.props.index,index, this.props.workflowIndex)}
                      selectedValue={this.props.TaskActivityData.TA_fields[index].field_type} />
                    <br />
                    {fieldTypeOptions}
                  </div>

                  <div className="inner">
                  <label>Requires Justification ?</label>
                  <Checkbox click={this.props.changeFieldCheck.bind(this, 'requires_justification', this.props.index, index, this.props.workflowIndex)} />
                  </div>

                  <div className = "inner block">
                    <label >Field Instructions (optional)</label>
                    <textarea className="big-text-field" placeholder="Type the instructions here..."
                      onChange={this.props.changeInputFieldData.bind(this, 'instructions', this.props.index,index, this.props.workflowIndex)}
                      value={this.props.TaskActivityData.TA_fields[index].instructions}></textarea>
                  </div>

                  <div className="inner block">
                    <label>Field Rubric</label>
                    <textarea className="big-text-field" placeholder="Type the rubric here..."
                      onChange={this.props.changeInputFieldData.bind(this,'rubric',this.props.index, index, this.props.workflowIndex)}
                      value={this.props.TaskActivityData.TA_fields[index].rubric}
                      ></textarea>
                  </div>

                  {justificationView}

                  <div className="inner block">
                    <label>Default content for the field</label>
                    <textarea className="big-text-field" placeholder="Default content for the field..."
                      onChange={this.props.changeInputFieldData.bind(this, 'default_content',this.props.index,index, this.props.workflowIndex)}
                      value={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                      ></textarea>
                  </div>
                  <br />
                  <br />
                </div>
              );
      }, this);


      let title = this.state.NewTask ? (this.props.TaskActivityData.TA_display_name) : (this.props.TaskActivityData.TA_display_name);
      return (

        <div className="section">
            <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true,
                                                                 NewTask: false});}} >{title}</h2>
              <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>

                <div className="section-divider">
                  <div className="inner">
                    <label>Does this task require any file uploads?</label>
                    <Checkbox isChecked={this.state.FileUp} click={ ()=>{
                        this.setState({
                          FileUp: this.state.FileUp ? false: true
                          });
                        }}  />
                  </div>
                  {fileUploadOptions}

                  <div className="inner " >
                    <label>Display name</label>
                    <br />
                    <input type="text" placeholder="Display Name "style={style} value={this.props.TaskActivityData.TA_display_name}
                            onChange={this.props.changeInputData.bind(this,'TA_display_name', this.props.index, this.props.workflowIndex)} ></input><br />
                  </div>

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
                    <button type="button" className="divider" onClick={this.props.addFieldButton.bind(this,this.props.index, this.props.workflowIndex)}><i className="fa fa-check"></i>Add another field</button>

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


                <div className={this.state.ShowAdvanced ? "section-divider" : "task-hiding"}>
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
                      <NumericInput
                          value={this.props.TaskActivityData.TA_due_type[1] / 1440 }
                          min={0}
                          size={6}
                          onChange={this.props.changeNumericData.bind(this,'TA_due_type',this.props.index, this.props.workflowIndex)}
                          />
                  </div>

                  <div className="inner">
                    <label>Delay before starting task</label>
                    <br />
                    <RadioGroup selectedValue={this.props.TaskActivityData.TA_start_delay != 0 ? true : 0 }
                                onChange={ this.props.changeRadioData.bind(this, 'TA_start_delay', this.props.index, this.props.workflowIndex)}
                                >
                      <label><Radio value={0} ></Radio>Start when prior task is complete</label>
                      <label><Radio value={true} ></Radio>Start after prior task ends by</label>
                    </RadioGroup>

                    <NumericInput
                        value={this.props.TaskActivityData.TA_start_delay}
                        min={0}
                        size={6}
                        onChange={ this.props.changeNumericData.bind(this, 'TA_start_delay', this.props.index, this.props.workflowIndex)
                        }/>

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
                    <Dropdown options={onTaskEndValues} onChange={this.props.changeDropdownData.bind(this, 'TA_at_duration_end', this.props.index, this.props.workflowIndex)}
                        value={this.props.TaskActivityData.TA_at_duration_end} />

                    {whatIfLateView}
                    </div>

                    <div className="inner">
                      <label>Award points just for doing the task on time</label>

                      <Checkbox click={this.props.changeSimpleGradeCheck.bind(this, this.props.index, this.props.workflowIndex)} />
                      <br />
                      {simpleGradeOptionsView}
                    </div>

                    <div className="inner">
                    </div>

                    <br />
                    <br />
                    <div className="inner">
                      <label>Allow a reflection of this task</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this, "TA_allow_reflection", this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_allow_reflection[0] != 'none'}/>
                    {allowReflectionOptions}
                    </div>

                    <div className="inner">
                        <label>Allow an assessment of this task</label>
                          <Checkbox click={this.props.changeDataCheck.bind(this,'TA_allow_assessment', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_allow_assessment != 'none'}/>
                        {allowAssesmentOptions}
                    </div>

                    <div className="inner">
                      <label>Allow a revision of this task</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this,"TA_allow_revisions",this.props.index, this.props.workflowIndex) }/>
                    </div>

                    <br />
                    <br />

                    <div className="inner">
                        <label>Assignee Constraints</label>
                        <br />
                        <label>Who can do this task</label>
                        <br />
                        <Dropdown options={assigneeWhoValues}
                                  selectedValue={this.props.TaskActivityData.TA_assignee_constraint[0]}
                                  onChange={this.props.changeDropdownData.bind(this,'TA_assignee_constraint', this.props.index, this.props.workflowIndex)}/>
                                  <label>Will this be a group task</label>
                                  <Checkbox click={this.props.changeDataCheck.bind(this,'TA_assignee_constraint', this.props.index, this.props.workflowIndex)} isClicked = {this.props.TaskActivityData.TA_assignee_constraint[1] == 'group'}/>
                    </div>

                    <div className="inner">
                      <label>Should this assignee have a specific relation to an assignee of another task in this problem</label>
                      <br />
                      <label>None</label>
                      <Checkbox click={this.props.checkAssigneeConstraints.bind(this, this.props.index, 'none', this.props.workflowIndex) } isClicked={ Object.keys(this.props.TaskActivityData.TA_assignee_constraint[2]).length === 0 ? true : false } style={{marginRight: '8px'}}/>
                      <label>New to Problem</label>
                      <Checkbox click={this.props.checkAssigneeConstraints.bind(this, this.props.index, 'not_in_workflow_instance', this.props.workflowIndex)}  isClicked={this.props.TaskActivityData.TA_assignee_constraint[2]['not_in_workflow_instance'] ? true : false}/>
                      <label>Same as</label>
                      <Checkbox click={()=> {
                          this.props.checkAssigneeConstraints(this.props.index, 'same_as', this.props.workflowIndex);
                          let newAssignee = this.state.ShowAssigneeConstraintSections;
                          newAssignee[0] = !this.state.ShowAssigneeConstraintSections[0];
                          this.setState({ShowAssigneeConstraintSections: newAssignee});
                        }} isClicked={this.props.TaskActivityData.TA_assignee_constraint[2]['same_as'] ? true : false }
                          style={{marginRight: '8px'}}/>
                      <label>In same group as</label>
                      <Checkbox click={()=> {
                          this.props.checkAssigneeConstraints(this.props.index, 'group_with_member', this.props.workflowIndex)
                          let newAssignee = this.state.ShowAssigneeConstraintSections;
                          newAssignee[1] = !this.state.ShowAssigneeConstraintSections[1];
                          this.setState({ShowAssigneeConstraintSections: newAssignee});
                        }} isClicked={this.props.TaskActivityData.TA_assignee_constraint[2]['group_with_member'] ? true : false }
                        style={{marginRight: '8px'}}/>
                      <label>Not in</label>
                      <Checkbox click={()=> {
                          this.props.checkAssigneeConstraints(this.props.index, 'not', this.props.workflowIndex)
                          let newAssignee = this.state.ShowAssigneeConstraintSections;
                          newAssignee[2] = !this.state.ShowAssigneeConstraintSections[2];
                          this.setState({ShowAssigneeConstraintSections: newAssignee});
                        }} isClicked={this.props.TaskActivityData.TA_assignee_constraint[2]['not'] ? true : false }
                          style={{marginRight: '8px'}} />
                      <label>Choose from </label>
                      <Checkbox click={()=> {
                          this.props.checkAssigneeConstraints(this.props.index, 'choose_from', this.props.workflowIndex)
                          let newAssignee = this.state.ShowAssigneeConstraintSections;
                          newAssignee[3] = !this.state.ShowAssigneeConstraintSections[3];
                          this.setState({ShowAssigneeConstraintSections: newAssignee});
                        }} isClicked={this.props.TaskActivityData.TA_assignee_constraint[2]['choose_from'] ? true : false }
                            />

                          <br />
                      {sameAsOptions}
                      {inSameGroupAsOptions}
                      {notInOptions}
                      {chooseFromOptions}
                    </div>


                    <br />
                    <br />

                    <div className="inner">
                      <label>Does this lead to a new problem?</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this,'TA_leads_to_new_problem', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_leads_to_new_problem} />
                    </div>

                    <div className="inner">
                      <label>Does this lead to a new solution?</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this,'TA_leads_to_new_solution', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_leads_to_new_solution} />
                    </div>

                  </div>
                  <br />

              </div>
        </div>);
    }
}

export default TaskDetailsComponent;
