/* This Component is contains the assignment input fields. It gets its data and functions from the AssignmentEditorContainer.
*/
import React from 'react';
import Select from 'react-select';
import NumberField from '../shared/numberField';
import ToggleSwitch from '../shared/toggleSwitch';
import Checkbox from '../shared/checkbox';
import ReactTooltip from 'react-tooltip';

class AssignmentDetailsComponent extends React.Component{
    constructor(props){
        super(props);

      /*
      Props:
            -AssignmentActivityData
            -Courses
            - Assignment functions
      */
        this.state = {
            ShowContent: true,
            ShowAdvanced: false,
            NumberofWorkflows: 1
        };
    }

    render(){
        let strings = this.props.Strings;
        let coursesView = null;
        let semesterView = null;

        let semesterList = this.props.Semesters;
        let courseList = this.props.Courses;
        let problemTypeList = [{value: 'essay',label:strings.Essay},{value:'homework',label:strings.Homework},{value:'quiz',label:strings.Quiz},{value:'lab',label:strings.Lab},{value:'other',label:strings.Other}];

        semesterView = (
        <div className="inner">
          <label>strings.RestrictToSemester</label>
          <Select options={semesterList}
             value={this.props.AssignmentActivityData.AA_semester}
            onChange={this.props.changeAssignmentDropdown.bind(this,'AA_semester')}
            clearable={false}
            searchable={false}
            />
        </div>
      );

        if(this.props.Courses){
            coursesView = (<div>
          <label>{strings.Course}</label>
          <Select options={courseList}
                  value={this.props.AssignmentActivityData.AA_course}
                  placeholder={strings.SelectACourse}
                  onChange={this.props.changeAssignmentDropdown.bind(this,'AA_course')}
                  clearable={false}
                  searchable={false}
            />

        </div>);
        }

        return (
        <div className="section card-2" >
          <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}> {this.props.AssignmentActivityData.AA_name} {strings.Parameters}</h2>
          <div className={this.state.ShowContent ? 'section-content' : 'task-hiding'}>
            <div className="section-divider">
              <div className="inner">
                <label>{strings.AssignmentName}</label>
                <i className="fa fa-info-circle tooltip-icon"  aria-hidden="true" data-tip={strings.HereIsNameForAssignment} data-for='test'></i>
                  <ReactTooltip id='test' effect='solid' />
                <br />
                <input placeholder={strings.Name} type="text" value={this.props.AssignmentActivityData.AA_name}
                  onChange={this.props.changeAssignmentInput.bind(this, 'AA_name') }
                  ></input>
              </div>

              <div className="inner">
                {coursesView}
              </div>

              <div className="inner">
                <label>{strings.AssignmentType}</label><i className="fa fa-info-circle tooltip-icon"  aria-hidden="true" data-tip={strings.SpecifyType} data-for='AA_type'></i>
                  <ReactTooltip id='AA_type' effect='solid'/>
                <Select options={problemTypeList}
                  value={this.props.AssignmentActivityData.AA_type}
                  onChange={this.props.changeAssignmentDropdown.bind(this, 'AA_type')}
                  clearable={false}
                  searchable={false}
                  />
              </div>

               {/*set numericinput max to real world limit of numebr of max problems*/}
              <div className='inner'>
                <label>{strings.HowManyDifferentTypesOfProblems}</label>
                <br />
                <NumberField min={1}
                            max={100}
                            value={this.props.AssignmentActivityData.NumberofWorkflows}
                            onChange={this.props.changeAssignmentNumeric.bind(this, 'NumberofWorkflows')} />

              </div>

              <div className="inner block">
                <label>{strings.AssignmentInstructions}</label>
                <br />
                <textarea placeholder={strings.Instructions} className="big-text-field" value={this.props.AssignmentActivityData.AA_instructions}
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
              {/*}
              <label style={{display: 'inline-block', float:'right'}}>Show Advanced Options?</label>
              <br />
              <ToggleSwitch click={ ()=> {
                  this.setState({ShowAdvanced : this.state.ShowAdvanced ? false : true});
                }} />
              <br />
              */}
              <div className={this.state.ShowAdvanced ? 'section-divider' : 'task-hiding'}>
                {semesterView}
                <br />
                <br />
                <br />


              </div>
            </div>

          </div>
        </div>
        );
    }
}

export default AssignmentDetailsComponent;
