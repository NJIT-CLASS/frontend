import React from 'react';
import NumericInput from 'react-numeric-input';
import Dropdown from 'react-dropdown';
var moment = require('moment');
import Checkbox from './checkbox';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
import {RadioGroup, Radio} from 'react-radio-group';

class TaskDetailsComponent extends React.Component{
    constructor(props){
      super(props);

      this.state = {
          TaskActivityData:{
            TA_type: TASK_TYPES.CREATE_PROBLEM,
            TA_file_upload: [[0,"mandatory"],[0,'optional']],
            TA_due_type: ['duration', 4320],
            TA_start_delay:0,
            TA_at_duration_end: 'late',
            TA_what_if_late: 'Keep same participant',
            TA_display_name: 'Create Problem',
            TA_one_or_separate: false,
            TA_assignee_constraint: [],
            TA_simple_grade: 'none',
            TA_is_final_grade: false,
            TA_overall_instructions: 'test',
            TA_overall_rubric: 'y',
            TA_allow_reflection: ['edit',"don't wait"],
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
                        instructions: 'H',
                        rubric: 'J',
                        justification_instructions: 'KD',
                        default_refers_to: [null, null],
                        default_content: ['D','']
                        }
            }
          },

          FileUp: false,
          FieldType: "text",
          Tasks: [{
            AtDurationEnd: '',
            WhatIfLate: '',
            Reflection: ['none', null]
          }],
          SimpleGradePointReduction: 0,
          ShowAdvanced: true,
          ShowContent: true
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

      let fieldTypeValues = [{value:'text',label:'Text'},{value:'assessment',label:'Assessment'},{value:'numeric',label:'Numeric'},{value:'self assessment',label:'Self Assessment'}];
      let assessmentTypeValues = [{value:'grade', label:'Numeric Grade'},{value: 'rating', label: 'Rating'},{value:'pass', label:'Pass/Fail'},{value:'evalutation', label: 'Evalutation by labels'}];
      let onTaskEndValues = ['late','resolved','abandon','complete'];
      let onLateValues = ['Keep same participant', 'Allocate new participant', 'Allocate to instructor','Allocate to different group member', 'Consider resolved'];
      let reflectionValues = [{value: 'edit', label:'Edit'},{value:'comment', label:'Comment'}];
      let assessmentValues = ['Grade','Critique','None'];
      let simpleGradeOptions = [{value: 'exists', label: ''}];
      let assigneeWhoValues = [{value:'student', label:'Student'}, {value:'instructor', label: 'Instructor'}];
      //display logic

      let advancedOptionsView = null;
      let simpleGradeOptionsView = null;
      let allowReflectionOptions = null;
      let allowAssesmentOptions = null;

      let fileUploadOptions= (<div style={{display:'inline-block',
                                          width:'360px'}}></div>);
      let advancedOptionsToggle = null;


      if(this.state.TaskActivityData.TA_simple_grade != 'none'){
        simpleGradeOptionsView = (<div>
          <label>Reduce this by what % per day late</label><br />
          <NumericInput
              value={this.state.SimpleGradePointReduction}
              min={0}
              size={6}
              style={numericInputStyle}
              onChange={(val) => {
                let newData = this.state.TaskActivityData;
                if(val == 0){
                  newData.TA_simple_grade = 'exists';
                }
                else{
                  newData.TA_simple_grade = 'off_per_day(' + val + ')';
                }
                this.setState({
                  TaskActivityData: newData,
                  SimpleGradePointReduction: val
                });
              }} />
          <br />
          <label>No Points If Late</label>
            <Checkbox click={()=> {
                let newData = this.state.TaskActivityData;
                if(newData.TA_simple_grade != 'off_per_day(100)'){
                  newData.TA_simple_grade = 'off_per_day(100)';
                  this.setState({
                    TaskActivityData: newData,
                    SimpleGradePointReduction: 100
                  })
                }
                else{
                  newData.TA_simple_grade = 'off_per_day(5)';
                  this.setState({
                    TaskActivityData: newData,
                    SimpleGradePointReduction: 5
                  })

                }

              }} />
          </div>);
      }

        advancedOptionsToggle = (
          <div className="toggle-switch false right" onClick={() => {
              this.setState({ShowAdvanced: this.state.ShowAdvanced ? false : true})
            }} >
            <div className="bubble"></div>
            <div className="text-true">Yes</div>
            <div className="text-false">No</div>
          </div>
        );



      if(this.state.FileUp){
        fileUploadOptions = (
          <div className="inner" style={instyle}>
            <div className="inner" style={instyle}>
              <label> How many required files</label> <br />
              <NumericInput

                  min={0}
                  size={6}
                  onChange={(val) => {
                    let newData = this.state.TaskActivityData;
                      newData.TA_file_upload[0][0] = val;
                      this.setState({
                        TaskActivityData: newData
                      });

                  }}
                  value={this.state.TaskActivityData.TA_file_upload[0][0]}
                  style={numericInputStyle}/>
            </div>
            <div className="inner" style={instyle}>
              <label> Maximum number of optional files</label> <br />
              <NumericInput
                  min={0}
                  size={6}
                  onChange={(val) => {
                    let newData = this.state.TaskActivityData;
                      newData.TA_file_upload[1][0] = val;
                      this.setState({
                        TaskActivityData: newData
                      });

                  }}
                  value={this.state.TaskActivityData.TA_file_upload[1][0]}
                  style={numericInputStyle}/>
            </div>
          </div>);
      }

      if(this.state.TA_allow_reflection[0] != 'none'){
        allowReflectionOptions = (<div>

          <Dropdown options={reflectionValues} onChange={(event) => {
              let newData = this.state.TaskActivityData;
              newData.TA_allow_reflection[0] = event.value;
              this.setState({TaskActivityData: newData});
            }} />
          <label>Who can reflect</label><br />
          <label>Students</label><div className="checkbox"></div>
          <label>Instructors</label><div className="checkbox"></div>
          <br />
          <label>Number of Editors</label>
          <NumericInput
              value={this.state.TaskActivityData.TA_number_participant}
              min={0}
              size={6}
              style={numericInputStyle}/>
            <br />
            <label>Should the reflections be consolidated</label><div className="checkbox"></div>
        </div>);
      }

      let inputFieldsView = this.state.TaskActivityData.TA_fields.field_titles.map(function(field, index){
        let justificationView = null; //justification textbox for the field
        let fieldTypeOptions = null; //options that change on Field Type dropbox selection
        let assessmentTypeView = null; //options that change on assessment type selection

        if(this.state.TaskActivityData.TA_fields[index].requires_justification){
          justificationView = (
          <div key={index + 200}>
            <label>Field Justification Instructions</label>
            <textarea className="big-text-field"
              value={this.state.TaskActivityData.TA_fields[index].justification_instructions}
              onChange={() => {
                let newData = this.state.TaskActivityData;
                newData.TA_fields[index].justification_instructions = event.target.value;
                this.setState({TaskActivityData: newData});
              }}></textarea>
          </div>)

        }

        if(this.state.TaskActivityData.TA_fields[index].field_type == "numeric"){
          fieldTypeOptions = (<div>
            <label>Min</label>
            <NumericInput

                min={0}
                size={6}
                value={this.state.TaskActivityData.TA_fields[index].numeric_min}
                style={numericInputStyle}
                onChange={ (val) => {
                  let newData = this.state.TaskActivityData;
                  newData.TA_fields[index].numeric_min = val;
                  this.setState({
                    TaskActivityData: newData
                  });
                }}
                />
              <label>Max</label>
              <NumericInput
                  value={this.state.TaskActivityData.TA_fields[index].numeric_max}
                  min={0}
                  size={6}
                  style={numericInputStyle}
                  onChange={ (val) => {
                    let newData = this.state.TaskActivityData;
                    newData.TA_fields[index].numeric_max = val;
                    this.setState({
                      TaskActivityData: newData
                    });
                  }}
                  />
              </div>);


        }

        else if(this.state.TaskActivityData.TA_fields[index].field_type == "assessment" || this.state.TaskActivityData.TA_fields[index].field_type == "self assessment"){
          fieldTypeOptions = (<div>

            <label>Assessment Type</label> <br/>

              <Dropdown key={index+300}
                options={assessmentTypeValues}
                onChange={ (event) => {
                  let newData = this.state.TaskActivityData;
                  newData.TA_fields[index].assessment_type = event.value;

                  this.setState({TaskActivityData: newData});
                  }}
                value={this.state.TaskActivityData.TA_fields[index].assessment_type} />

              <br />
              {assessmentTypeView}
          </div>);



        }

        return (<div className="section-divider">
                  <h3 className="subheading">Input Fields</h3>
                  <div className="inner" style={instyle}>
                    <label>Field Name</label> <br />
                    <input type="text" style={style}
                      value={this.state.TaskActivityData.TA_fields[index].title}
                      onChange={ (event) => {
                        let newData = this.state.TaskActivityData;
                        newData.TA_fields[index].title = event.target.value;
                        newData.TA_fields.field_titles[index] = event.target.value;
                        this.setState({TaskActivityData: newData});
                        }}></input>
                  </div>

                  <div className="inner" style={instyle}>
                    <label>Field Type</label> <br />

                    <Dropdown key={index}
                      options={fieldTypeValues}
                      onChange={ (event) => {
                        let newData = this.state.TaskActivityData;
                        newData.TA_fields[index].field_type = event.value;
                        this.setState({TaskActivityData: newData});
                        }}
                      value={this.state.TaskActivityData.TA_fields[index].field_type} />
                    <br />
                    {fieldTypeOptions}
                  </div>

                  <div className="inner">
                  <label>Requires Justification ?</label>
                  <Checkbox click={() => {
                      let newData = this.state.TaskActivityData;
                      newData.TA_fields[index].requires_justification = this.state.TaskActivityData.TA_fields[index].requires_justification ? false : true;

                      this.setState({TaskActivityData: newData});
                    }} />

                  </div>
                  <div>
                    <label >Field Instructions (optional)</label>
                    <textarea className="big-text-field"
                      onChange={ (event) => {
                        let newData = this.state.TaskActivityData;
                        newData.TA_fields[index].instructions = event.target.value;
                        this.setState({TaskActivityData: newData});
                        }}
                      value={this.state.TaskActivityData.TA_fields[index].instructions}></textarea>
                  </div>
                  <label>Field Rubric</label>
                  <textarea className="big-text-field"
                    onChange={ (event) => {
                      let newData = this.state.TaskActivityData;
                      newData.TA_fields[index].rubric = event.target.value;
                      this.setState({TaskActivityData: newData});
                      }}
                    value={this.state.TaskActivityData.TA_fields[index].rubric}
                    ></textarea>
                  {justificationView}
                  <label>Default content for the field</label>
                  <textarea className="big-text-field"
                    onChange={ (event) => {
                      let newData = this.state.TaskActivityData;
                      newData.TA_fields[index].default_content[0] = event.target.value;
                      this.setState({TaskActivityData: newData});
                      }}

                    value={this.state.TaskActivityData.TA_fields[index].default_content[0]}
                    ></textarea>
                  <br />

                  <br />
                </div>
              );
      }, this);



      return (
        <div className="section">
            <h2 className="title" div onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}} >Create Problem Task</h2>
              <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>

                <div >
                  <div className="inner" style={instyle}>
                    <label>Does this task require any file uploads?</label><br />
                    <div className="checkbox" checked={this.state.FileUp} onClick={ ()=>{
                        this.setState({
                          FileUp: this.state.FileUp ? false: true
                          });
                        }} value={"t-fileUp"} style={style}></div>
                  </div>
                  {fileUploadOptions}

                  <div className="inner" style={instyle}>
                    <label>Display name</label><br />
                    <input type="text" style={style} value={this.state.TaskActivityData.TA_display_name} onChange={(event) => {

                      let newData = this.state.TaskActivityData;
                        newData.TA_display_name = event.target.value;
                        this.setState({
                          TaskActivityData: newData
                        });

                    }} ></input><br />
                  </div>
                </div>

                <label>Task Instructions</label>
                <textarea className="big-text-field"
                          onChange={(event) => {
                            let newData = this.state.TaskActivityData;
                              newData.TA_overall_instructions = event.target.value;
                              this.setState({
                                TaskActivityData: newData
                              });
                            }}

                          value={this.state.TaskActivityData.TA_overall_instructions}
                          ></textarea>
                <label>Task Rubric</label>
                <textarea className="big-text-field"
                          onChange={(event) => {
                          let newData = this.state.TaskActivityData;
                            newData.TA_overall_rubric = event.target.value;
                            this.setState({
                              TaskActivityData: newData
                            });
                            }}
                          value={this.state.TaskActivityData.TA_overall_rubric}
                          ></textarea>
                {inputFieldsView}
                <button type="button" className="divider" onClick={()=>{
                    let newData = this.state.TaskActivityData;
                    newData.TA_fields.number_of_fields += 1;
                    newData.TA_fields.field_titles.push('');
                    this.setState({
                      TaskActivityData: newData
                    })
                  }}><i className="fa fa-check"></i>Add another field</button>
                {advancedOptionsToggle}
                <div className={this.state.ShowAdvanced ? "section-divider" : "task-hiding"}>
                  <br />
                  <div className="inner">
                      <label>Should this task end at a certain time</label>
                      <br />
                      <RadioGroup
                        selectedValue={this.state.TaskActivityData.TA_due_type[0]}
                        onChange={ (val)=> {
                          let newData = this.state.TaskActivityData;
                          newData.TA_due_type[0] = val;
                          this.setState({TaskActivityData: newData});
                        }} >
                        <label>
                          <Radio value="duration" />
                          Expire After
                        </label>
                        <label><Radio value="specific time" />End at this time</label>

                      </RadioGroup>
                      <br />
                      <NumericInput
                          value={this.state.TaskActivityData.TA_due_type[1] / 1440 }
                          min={0}
                          size={6}
                          style={numericInputStyle}
                          onChange={ (val) => {
                            let newData = this.state.TaskActivityData;
                            newData.TA_due_type[1] = val * 1440;
                            this.setState({
                              TaskActivityData: newData
                            });
                          }}
                          />
                  </div>


                  <div className="inner">
                    <label>Delay before starting task</label>
                    <br />
                    <RadioGroup selectedValue={this.state.TaskActivityData.TA_start_delay != 0 ? true : 0 }
                                onChange={ (val)=> {
                                  let newData = this.state.TaskActivityData;
                                  newData.TA_start_delay = val;
                                  this.setState({TaskActivityData: newData});
                                }}
                                >
                      <label><Radio value={0} ></Radio>Start when prior task is complete</label>
                      <label><Radio value={true} ></Radio>Start after prior task ends by</label>
                    </RadioGroup>

                    <NumericInput
                        value={this.state.TaskActivityData.TA_start_delay}
                        min={0}
                        size={6}
                        style={numericInputStyle}
                        onChange={ (val) => {
                          let newData = this.state.TaskActivityData;
                          newData.TA_start_delay = val;
                          this.setState({TaskActivityData: newData})
                          }
                        }/>

                  </div>

                  <div className= "inner">
                    <label>Does everyone get the same problem</label> <br />
                    <RadioGroup selectedValue={this.state.TaskActivityData.TA_one_or_separate} onChange={
                        (val) => {
                          let newData = this.state.TaskActivityData;
                          newData.TA_one_or_separate = val;
                          this.setState({TaskActivityData: newData});
                        }
                      }>
                      <label><Radio value={false}/> No</label>
                      <label><Radio value={true} /> Yes</label>
                    </RadioGroup>
                  </div>

                  <br/>
                  <br />
                  <div className="inner" >
                    <label>What happens when the task ends</label> <br/>
                    <Dropdown options={onTaskEndValues} onChange={ (event) => {
                        let newTasks = this.state.TaskActivityData;
                        newTasks.TA_at_duration_end = event.value;
                        this.setState({Tasks: newTasks}); }}
                        value={this.state.TaskActivityData.TA_at_duration_end} />
                    <br />
                    <label> What happens if late</label>
                    <Dropdown options={onLateValues}
                      onChange={ (event) => {
                        let newTasks = this.state.TaskActivityData;
                        newTasks.TA_what_if_late = event.value;
                        this.setState({Tasks: newTasks}); }}
                        value={this.state.TaskActivityData.TA_what_if_late} />
                    </div>

                    <div className="inner">
                      <label>Award points just for doing the task on time</label>

                      <div className="checkbox" onClick={ () =>{
                          let temp = null;
                          if(this.state.TaskActivityData.TA_simple_grade == 'none'){
                            temp = "exists";
                          }
                          else{
                            temp = 'none';
                          }

                          let newData = this.state.TaskActivityData;
                          newData.TA_simple_grade = temp;
                          this.setState({
                            TaskActivityData: newData,
                            SimpleGradePointReduction:1
                          });
                        }}></div>
                      <br />
                      {simpleGradeOptionsView}
                    </div>

                    <div className="inner">
                    </div>

                    <br />
                    <br />
                    <div className="inner">
                      <label>Allow a reflection of this task</label>
                      <Checkbox click={() => {
                          if(this.state.TaskActivityData.TA_allow_reflection[0] != 'none'){
                            this.state.TaskActivityData.TA_allow_reflection[0] = 'none'
                          }
                          else{
                            this.state.TaskActivityData.TA_allow_reflection[0] = 'edit'
                          }
                      }} />
                    {allowReflectionOptions}
                    </div>

                    <div className="inner">
                        <label>Allow an assessment of this task</label>
                        <div className="checkbox"></div>
                        <Dropdown options={assessmentValues} />
                        <label>Who can assess</label><br />
                        <label>Students</label><div className="checkbox"></div>
                        <label>Instructors</label><div className="checkbox"></div>
                        <br />
                        <label>Number of Assessors</label>
                        <br />
                        <NumericInput
                            value={2}
                            min={0}
                            size={6}
                            style={numericInputStyle}/>
                          <br />
                          <label>Should the assessments be consolidated</label><div className="checkbox"></div>
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
                          <br />
                          <label>Can a student dispute the grade</label><div className="checkbox"></div>
                    </div>

                    <div className="inner">
                      <label>Allow a revision of this task</label>
                      <Checkbox click={ () => {
                          let newData = this.state.TaskActivityData;
                          newData.TA_allow_revisions = this.state.TaskActivityData.TA_allow_revisions ? false : true;
                          this.setState({
                            TaskActivityData: newData
                          })
                        } }/>
                    </div>

                    <br />
                    <br />

                    <div className="inner">
                        <label>Assignee Constraints</label>
                        <br />
                        <label>Who can do this task</label>
                        <Dropdown options={assigneeWhoValues}
                                  selectedValue={this.state.TaskActivityData.TA_assignee_constraint[0]}
                                  onChange={ (event) =>
                                    {
                                      let newData = this.state.TaskActivityData;
                                      newData.TA_assignee_constraint[0] = event.value;
                                      this.setState({
                                        TaskActivityData: newData
                                      })
                                    }}/>
                        <label>Will this be a group task</label><div className="checkbox"></div>
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
                      <div className="checkbox"></div>
                    </div>

                    <div className="inner">
                      <label>Does this lead to a new solution?</label>
                      <div className="checkbox"></div>
                    </div>

                  </div>
                  <br />
                  <button className="divider">Continue</button>
              </div>
        </div>);
    }
}

export default TaskDetailsComponent;
