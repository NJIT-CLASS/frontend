import React from 'react';
import Dropdown from 'react-dropdown';
import NumericInput from 'react-numeric-input';
import Checkbox from '../shared/checkbox';

class AssignmentDetailsComponent extends React.Component{
    constructor(props){
      super(props);

      this.state = {
        ShowContent: true,
        NumberofWorkflows: 1
      };
    }


    //assignment details functions

    render(){
      let style={marginRight: "10px",
                marginLeft:'10px'};
      let instyle = {display: "inline-block"};

      let courseList = ['CS 288', 'CS 341', 'CS 113'];
      let problemTypeList = [{value: 'essay',label:'Essay'},{value:'homework',label:'Homework'},{value:'quiz',label:'Quiz'},{value:'lab',label:'Lab'},{value:'other',label:'Other'}];


      return (
        <div className="section card-1">
          <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}> Assignment Parameters</h2>
          <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>
            <div className="section-divider">
              <div className="inner">
                <label>Assignment Name</label>
                <br />
                <input placeholder="Name" type="text" value={this.props.AssignmentActivityData.AA_name}
                  onChange={this.props.changeAssignmentInput.bind(this, 'AA_name') }
                  ></input>
              </div>

              <div className="inner">
                <label>Course</label>
                <Dropdown options={courseList} selectedValue={this.props.AssignmentActivityData.AA_course}
                          onChange={this.props.changeAssignmentDropdown.bind(this, 'AA_course')}/>
              </div>

              <div className="inner">
                <label>Assignment Type</label>
                <Dropdown options={problemTypeList} selectedValue={this.props.AssignmentActivityData.AA_type}
                  onChange={this.props.changeAssignmentDropdown.bind(this, 'AA_type')}
                  />
              </div>

               {/*set numericinput max to real world limit of numebr of max problems*/}
              <div className='inner'>
                <label> How Many Different Types of Problems</label>
                <br />
                <NumericInput
                  value={this.props.AssignmentActivityData.NumberofWorkflows}
                  min={1}
                  max={100}
                  size={6}
                  onChange={this.props.changeAssignmentNumeric.bind(this, 'NumberofWorkflows')}
                  />
              </div>

              <div className="inner block">
                <label>Instructions</label>
                <br />
                <textarea placeholder="Instructions" className="big-text-field" value={this.props.AssignmentActivityData.AA_instructions}
                  onChange={this.props.changeAssignmentInput.bind(this, 'AA_instructions')} ></textarea>
              </div>

              <br />
              {/*
              <label style={{display: 'inline-block', float:'right'}}>Show Advanced Options?</label>
              <br />
              <div className="toggle-switch false" style={{float:'right', clear: 'right', margin: '8px 0px' }} onClick={() => {
                  this.setState({ShowAdvanced: this.state.ShowAdvanced ? false : true})
                }} >
                <div className="bubble"></div>
                <div className="text-true">Yes</div>
                <div className="text-false">No</div>
              </div>*/}
              <br />
            </div>

          </div>
        </div>
      );
    }
}

export default AssignmentDetailsComponent;
