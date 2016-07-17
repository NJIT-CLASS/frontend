import React from 'react';
import NumericInput from 'react-numeric-input';
import Dropdown from 'react-dropdown';
var moment = require('moment');
import Checkbox from './checkbox';
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
          FieldType: "text",
          Tasks: [{
            AtDurationEnd: '',
            WhatIfLate: '',
            Reflection: ['none', null]
          }],
          SimpleGradePointReduction: 0,
          ShowAdvanced: false,
          ShowContent: this.props.isOpen ? true : false
      };
    }






    render(){
      let style={marginRight: "10px",
                marginLeft:'10px'};
      let instyle = {display: "inline-block"};
      let numericInputStyle = {   display: 'block',
                                  input: {
                                    height:'35px !important',
                                    width:'fit-content',
                                    marginLeft: '10px',
                                    marginRight: '10px',
                                    marginTop: '5px !important'

                                  },
                                  'input:hover': {
                                      borderColor: '#00AB8D',
                                      cursor: 'pointer'
                                  },
                                  btnUp: {
                                      height: '32px',
                                      marginTop: '4px',
                                       borderRadius: '2px 2px 0 0',
                                       borderWidth : '1px 1px 0 1px',
                                       marginRight: '10px'
                                   },

                                   btnDown: {
                                      marginLeft:'10px',
                                      marginTop: '4px',
                                       height: '32px',
                                       borderRadius: '0 0 2px 2px',
                                       borderWidth : '0 1px 1px 1px'
                                   }
                                };
      //for future work, change labels to translatable string variables, keep values the sames
      let fieldTypeValues = [{value:'text',label:'Text'},{value:'numeric',label:'Numeric'},{value:'assessment',label:'Assessment'},{value:'self assessment',label:'Self Assessment'}];
      let assessmentTypeValues = [{value:'grade', label:'Numeric Grade'},{value: 'rating', label: 'Rating'},{value:'pass', label:'Pass/Fail'},{value:'evalutation', label: 'Evalutation by labels'}];
      let onTaskEndValues = [{value:'late', label: "Late"},'resolved','abandon','complete'];
      let onLateValues = ['Keep same participant', 'Allocate new participant', 'Allocate to instructor','Allocate to different group member', 'Consider resolved'];
      let reflectionValues = [{value: 'edit', label:'Edit'},{value:'comment', label:'Comment'}];
      let assessmentValues = [{value:'grade',label:'Grade'},{value: 'critique', label: 'Critique'},{value:'none', label:'None'}];
      let simpleGradeOptions = [{value: 'exists', label: ''}];
      let assigneeWhoValues = [{value:'student', label:'Student'}, {value:'instructor', label: 'Instructor'}];
      //display logic

      let advancedOptionsView = null;
      let simpleGradeOptionsView = null;
      let allowReflectionOptions = null;
      let allowAssesmentOptions = null;
      let whatIfLateView = null;

      let fileUploadOptions= (<div style={{display:'inline-block',
                                          width:'100px'}}></div>);

      if(this.props.TaskActivityData.TA_allow_assessment != 'none'){
        let showConsol= this.props.getAssessNumberofParticipants(this.props.index) > 1 ? (
          <div>
            <label>Should the assessments be consolidated</label>
            <Checkbox click={this.props.changeDataCheck.bind(this, "Assess_Consolidate", this.props.index)}/>
            <br />
            <label>Grading Threshold</label>
            <br />
            <label>Points</label><input type="radio"></input>
            <label>Percentage</label><input type="radio"></input>
            <br />
            <NumericInput
                value={2}
                min={0}
                size={6}
                style={numericInputStyle} />
              <br />
            <label>To be consolidated, the grade should be: </label>
            <Dropdown options={['max','sum','average']} />
          </div>) : null;

        let showDispute = (<div>
          <label> Can students dispute this reflection </label>
          <Checkbox click={this.props.changeDataCheck.bind(this, "Assess_Dispute", this.props.index)}/>
          </div>);

        allowAssesmentOptions = (<div>
          <Dropdown options={assessmentValues}  onChange={this.props.changeDropdownData.bind(this,'TA_allow_assessment',this.props.index)} selectedValue={this.props.TaskActivityData.TA_allow_assessment} />
          <label>Who can assess</label>
          <br />
          <label>Students</label><div className="checkbox"></div>
          <label>Instructors</label><div className="checkbox"></div>
          <br />
          <label>Number of Assessors</label>
          <br />
          <NumericInput
            value={this.props.getAssessNumberofParticipants(this.props.index)}
            min={1}
            size={6}
            style={numericInputStyle}
            onChange = {this.props.setAssessNumberofParticipants.bind(this, this.props.index)} />
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
              style={numericInputStyle}
              onChange={this.props.changeTASimpleGradePoints.bind(this.props.index)} />
          <br />
          <label>No Points If Late</label>
            <Checkbox click={this.props.changeTASimpleGradeCheck.bind(this.props.index)} />
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
                  onChange={this.props.changeFileUpload.bind(this.props.index,0,0)}
                  value={this.props.TaskActivityData.TA_file_upload[0][0]}
                  style={numericInputStyle} />
            </div>
            <div className="inner" style={instyle}>
              <label> Maximum number of optional files</label> <br />
              <NumericInput
                  min={0}
                  size={6}
                  onChange={this.props.changeFileUpload.bind(this.props.index,1,0)}
                  value={this.props.TaskActivityData.TA_file_upload[1][0]}
                  style={numericInputStyle}/>

            </div>
          </div>);
      }

      if(this.props.TaskActivityData.TA_at_duration_end == 'late'){
        whatIfLateView = (<div>
          <label> What happens if late</label>
        <Dropdown options={onLateValues}
          onChange={ this.props.changeDropdownData.bind(this,'TA_what_if_late',this.props.index)}
            value={this.props.TaskActivityData.TA_what_if_late} />
          </div>
        )
      }

      if(this.props.TaskActivityData.TA_allow_reflection[0] != 'none'){

        let showConsol= this.props.getReflectNumberofParticipants(this.props.index) > 1 ? (
          <div>
          <label>Should the reflections be consolidated</label>
        <Checkbox click={this.props.changeDataCheck.bind(this, "Reflect_Consolidate", this.props.index)}/></div>) : null;

        let showDispute = (<div>
          <label> Can students dispute this reflection </label>
          <Checkbox click={this.props.changeDataCheck.bind(this, "Reflect_Dispute", this.props.index)}/>
          </div>);

        allowReflectionOptions = (<div>

          <Dropdown options={reflectionValues} onChange={this.props.changeDropdownData.bind(this,'TA_allow_reflection',this.props.index)} selectedValue={this.props.TaskActivityData.TA_allow_reflection[0]}/>
          <label>Who can reflect</label><br />
          <label>Students</label><div className="checkbox"></div>
          <label>Instructors</label><div className="checkbox"></div>
          <br />
          <label>Number of Editors</label>
          <br />
          <NumericInput
              value={this.props.getReflectNumberofParticipants(this.props.index)}
              min={1}
              size={6}
              style={numericInputStyle}
              onChange = {this.props.setReflectNumberofParticipants.bind(this, this.props.index)}
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
              onChange={this.props.changeInputFieldData.bind(this,'justification_instructions',this.props.index, index)}></textarea>
          </div>)

        }

        if(this.props.TaskActivityData.TA_fields[index].field_type == "numeric"){
          fieldTypeOptions = (<div>
            <label>Min</label>
            <NumericInput

                min={0}
                size={6}
                value={this.props.TaskActivityData.TA_fields[index].numeric_min}
                style={numericInputStyle}
                onChange={this,props.changeNumericFieldData.bind(this,'numeric_min', this.props.index, index)
                }
                />
              <label>Max</label>
              <NumericInput
                  value={this.props.TaskActivityData.TA_fields[index].numeric_max}
                  min={0}
                  size={6}
                  style={numericInputStyle}
                  onChange={ this.props.changeNumericFieldData.bind(this,"numeric_max",this.props.index,index )}
                  />
              </div>);


        }

        else if(this.props.TaskActivityData.TA_fields[index].field_type == "assessment" || this.props.TaskActivityData.TA_fields[index].field_type == "self assessment"){
          fieldTypeOptions = (<div>

            <label>Assessment Type</label> <br/>

              <Dropdown key={index+300}
                options={assessmentTypeValues}
                onChange={this.props.changeDropdownFieldData.bind(this, 'assessment_type', this.props.index, index)}
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
                      onChange={this.props.changeFieldName.bind(this,this.props.index,index)}></input>
                  </div>

                  <div className="inner">
                    <label>Field Type</label> <br />

                    <Dropdown key={index}
                      options={fieldTypeValues}
                      onChange={this.props.changeDropdownFieldData.bind('field_type', this.props.index,index)}
                      selectedValue={this.props.TaskActivityData.TA_fields[index].field_type} />
                    <br />
                    {fieldTypeOptions}
                  </div>

                  <div className="inner">
                  <label>Requires Justification ?</label>
                  <Checkbox click={this.props.changeFieldCheck.bind(this, 'requires_justification', this.props.index, index)} />
                  </div>

                  <div className = "inner block">
                    <label >Field Instructions (optional)</label>
                    <textarea className="big-text-field" placeholder="Type the instructions here..."
                      onChange={this.props.changeInputFieldData.bind(this, 'instructions', this.props.index,index)}
                      value={this.props.TaskActivityData.TA_fields[index].instructions}></textarea>
                  </div>

                  <div className="inner block">
                    <label>Field Rubric</label>
                    <textarea className="big-text-field" placeholder="Type the rubric here..."
                      onChange={this.props.changeInputFieldData.bind(this,this.props.index, index)}
                      value={this.props.TaskActivityData.TA_fields[index].rubric}
                      ></textarea>
                  </div>

                  {justificationView}

                  <div className="inner block">
                    <label>Default content for the field</label>
                    <textarea className="big-text-field" placeholder="Default content for the field..."
                      onChange={this.props.changeInputFieldData.bind(this, 'default_content',this.props.index,index)}
                      value={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                      ></textarea>
                  </div>
                  <br />
                  <br />
                </div>
              );
      }, this);



      return (
        <div className="section card-1">
            <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}} >{this.props.TaskActivityData.TA_display_name}</h2>
              <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>

                <div className="section-divider">
                  <div className="inner">
                    <label>Does this task require any file uploads?</label>
                    <div className="checkbox" checked={this.state.FileUp} onClick={ ()=>{
                        this.setState({
                          FileUp: this.state.FileUp ? false: true
                          });
                        }} value={"t-fileUp"} style={style}></div>
                  </div>
                  {fileUploadOptions}

                  <div className="inner " >
                    <label>Display name</label>
                    <br />
                    <input type="text" placeholder="Display Name "style={style} value={this.props.TaskActivityData.TA_display_name}
                            onChange={this.props.changeInputData.bind(this,'TA_display_name', this.props.index)} ></input><br />
                  </div>

                  <br />
                  <div className="inner block">
                    <label>Task Instructions</label>
                    <textarea className="big-text-field" placeholder="Type the instructions here..."
                              onChange={this.props.changeInputData.bind(this,'TA_overall_instructions', this.props.index)}
                              value={this.props.TaskActivityData.TA_overall_instructions}
                              ></textarea>
                    </div>
                    <br />
                    <div className="inner block">
                      <label>Task Rubric</label>
                      <textarea className="big-text-field" placeholder="Type the rubric here..."
                                onChange={this.props.changeInputData.bind(this,'TA_overall_rubric', this.props.index)}
                                value={this.props.TaskActivityData.TA_overall_rubric}
                                ></textarea>
                      </div>
                </div>

                {inputFieldsView}
                <div className="section-divider">
                  <div className="inner block" style={{alignContent:'right'}}>
                    <button type="button" className="divider" onClick={this.props.addFieldButton.bind(this,this.props.index)}><i className="fa fa-check"></i>Add another field</button>

                    <br />
                    <br />
                    <br />
                    <br />
                    <label style={{display: 'inline-block', float:'right'}}>Show Advanced Options?</label>
                    <br />
                    <div className="toggle-switch false" style={{float:'right', clear: 'right', margin: '8px 0px' }} onClick={() => {
                        this.setState({ShowAdvanced: this.state.ShowAdvanced ? false : true})
                      }} >
                      <div className="bubble"></div>
                      <div className="text-true">Yes</div>
                      <div className="text-false">No</div>
                    </div>
                  </div>
                </div>


                <div className={this.state.ShowAdvanced ? "section-divider" : "task-hiding"}>
                  <br />
                  <div className="inner">
                      <label>Should this task end at a certain time</label>
                      <br />
                      <RadioGroup
                        selectedValue={this.props.TaskActivityData.TA_due_type[0]}
                        onChange={this.props.changeRadioData.bind(this,'TA_due_type', this.props.index)} >
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
                          style={numericInputStyle}
                          onChange={this.props.changeNumericData.bind(this,'TA_due_type',this.props.index)}
                          />
                  </div>

                  <div className="inner">
                    <label>Delay before starting task</label>
                    <br />
                    <RadioGroup selectedValue={this.props.TaskActivityData.TA_start_delay != 0 ? true : 0 }
                                onChange={ this.props.changeRadioData.bind(this, 'TA_start_delay', this.props.index)}
                                >
                      <label><Radio value={0} ></Radio>Start when prior task is complete</label>
                      <label><Radio value={true} ></Radio>Start after prior task ends by</label>
                    </RadioGroup>

                    <NumericInput
                        value={this.props.TaskActivityData.TA_start_delay}
                        min={0}
                        size={6}
                        style={numericInputStyle}
                        onChange={ this.props.changeNumericData.bind(this, 'TA_start_delay', this.props.index)
                        }/>

                  </div>

                  <div className= "inner">
                    <label>Does everyone get the same problem</label> <br />
                    <RadioGroup selectedValue={this.props.TaskActivityData.TA_one_or_separate} onChange={
                        this.props.changeRadioData.bind(this,'TA_one_or_separate', this.props.index)
                      }>
                      <label><Radio value={false}/> No</label>
                      <label><Radio value={true} /> Yes</label>
                    </RadioGroup>
                  </div>

                  <br/>
                  <br />
                  <div className="inner" >
                    <label>What happens when the task ends</label> <br/>
                    <Dropdown options={onTaskEndValues} onChange={this.props.changeDropdownData.bind(this, 'TA_at_duration_end', this.props.index)}
                        value={this.props.TaskActivityData.TA_at_duration_end} />

                    {whatIfLateView}
                    </div>

                    <div className="inner">
                      <label>Award points just for doing the task on time</label>

                      <Checkbox click={this.props.changeSimpleGradeCheck.bind(this, this.props.index)} />
                      <br />
                      {simpleGradeOptionsView}
                    </div>

                    <div className="inner">
                    </div>

                    <br />
                    <br />
                    <div className="inner">
                      <label>Allow a reflection of this task</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this, "TA_allow_reflection", this.props.index)} isClicked={this.props.TaskActivityData.TA_allow_reflection[0] != 'none'}/>
                    {allowReflectionOptions}
                    </div>

                    <div className="inner">
                        <label>Allow an assessment of this task</label>
                          <Checkbox click={this.props.changeDataCheck.bind(this,'TA_allow_assessment', this.props.index)} isClicked={this.props.TaskActivityData.TA_allow_assessment != 'none'}/>
                        {allowAssesmentOptions}
                    </div>

                    <div className="inner">
                      <label>Allow a revision of this task</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this,"TA_allow_revisions",this.props.index) }/>
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
                                  onChange={this.props.changeDropdownData.bind(this,'TA_assignee_constraint', this.props.index)}/>
                                  <label>Will this be a group task</label>
                                  <Checkbox click={this.props.changeDataCheck.bind(this,'TA_assignee_constraint', this.props.index)}/>
                    </div>

                    <div className="inner">
                      <label>Should this assignee have a specific relation to an assignee of another task in this problem</label>
                      <br />
                      <label>None</label>
                      <div className="checkbox"></div>
                      <label>Same as</label>
                      <div className="checkbox"></div>
                      <label>In same group as</label>
                      <div className="checkbox"></div>
                      <label>Not in</label>
                      <div className="checkbox"></div>
                      <label>Choose from </label>
                      <div className="checkbox"></div>
                      <br />
                      <div className="checkbox-group inner">
                        <div className="checkbox"></div><label>Edit Problem</label><br />
                        <div className="checkbox"></div><label>Solve Problem</label><br />
                        <div className="checkbox"></div><label>Grade Problem 1</label><br />
                        <div className="checkbox"></div><label>Grade Problem 2</label><br />
                        <div className="checkbox"></div><label>Dispute  Grade</label><br />
                      </div>
                      <div className="checkbox-group inner">
                        <div className="checkbox"></div><label>Edit Problem</label><br />
                        <div className="checkbox"></div><label>Solve Problem</label><br />
                        <div className="checkbox"></div><label>Grade Problem 1</label><br />
                        <div className="checkbox"></div><label>Grade Problem 2</label><br />
                        <div className="checkbox"></div><label>Dispute  Grade</label><br />
                      </div>
                      <div className="checkbox-group inner">
                        <div className="checkbox"></div><label>Edit Problem</label><br />
                        <div className="checkbox"></div><label>Solve Problem</label><br />
                        <div className="checkbox"></div><label>Grade Problem 1</label><br />
                        <div className="checkbox"></div><label>Grade Problem 2</label><br />
                        <div className="checkbox"></div><label>Dispute  Grade</label><br />
                      </div>
                      <div className="checkbox-group inner">
                        <div className="checkbox"></div><label>Edit Problem</label><br />
                        <div className="checkbox"></div><label>Solve Problem</label><br />
                        <div className="checkbox"></div><label>Grade Problem 1</label><br />
                        <div className="checkbox"></div><label>Grade Problem 2</label><br />
                        <div className="checkbox"></div><label>Dispute  Grade</label><br />
                      </div>
                    </div>


                    <br />
                    <br />

                    <div className="inner">
                      <label>Does this lead to a new problem?</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this,'TA_leads_to_new_problem', this.props.index)} isClicked={this.props.TaskActivityData.TA_leads_to_new_problem} />
                    </div>

                    <div className="inner">
                      <label>Does this lead to a new solution?</label>
                      <Checkbox click={this.props.changeDataCheck.bind(this,'TA_leads_to_new_solution', this.props.index)} isClicked={this.props.TaskActivityData.TA_leads_to_new_solution} />
                    </div>

                  </div>
                  <br />
                  <button className="divider">Continue</button>
              </div>
        </div>);
    }
}

export default TaskDetailsComponent;
