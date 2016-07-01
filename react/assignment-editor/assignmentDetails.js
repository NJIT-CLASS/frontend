import React from 'react';
import Dropdown from 'react-dropdown';
import NumericInput from 'react-numeric-input';
import Checkbox from './checkbox';

class AssignmentDetailsComponent extends React.Component{
    constructor(props){
      super(props);

      this.state = {
        ShowContent: true,
        AssignmentActivityData: {
          AA_name:'',
          AA_course:'',
          AA_instructions:'',
          AA_type:'',
          AA_display_name: '',
          AA_section:[],
          AA_semester: [],
          AA_grade_distribution: []
        },
        NumberofWorkflows: 1
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

      let courseList = ['CS 288', 'CS 341', 'CS 113'];
      let problemTypeList = [{value: 'essay',label:'Essay'},{value:'homework',label:'Homework'},{value:'quiz',label:'Quiz'},{value:'lab',label:'Lab'},{value:'other',label:'Other'}];

      let advancedOptionsToggle = (
        <div className="toggle-switch false right" onClick={() => {
            this.setState({ShowAdvanced: this.state.ShowAdvanced ? false : true})
          }} >
          <div className="bubble"></div>
          <div className="text-true">Yes</div>
          <div className="text-false">No</div>
        </div>
      );
      return (
        <div className="section">
          <h2 className="title" > Assignment Parameters</h2>
          <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>
            <div className="section-divider">
              <div className="inner">
                <label>Assignment Name</label>
                <br />
                <input type="text" value={this.state.AssignmentActivityData.AA_name}
                  onChange={ (event) => {
                      let newData = this.state.AssignmentActivityData;
                      newData.AA_name = event.target.value;
                      this.setState({
                        AssignmentActivityData: newData
                      });
                    }}
                  ></input>
              </div>

              <div className="inner">
                <label>Course</label>
                <Dropdown options={courseList} selectedValue={this.state.AssignmentActivityData.AA_course}  />
              </div>

              <div className="inner">
                <label>Problem Type</label>
                <Dropdown options={problemTypeList} selectedValue={this.state.AssignmentActivityData.AA_type}/>
              </div>

              <div className='inner'>
                <label> How Many Problems</label>
                <br />
                <NumericInput
                  value={this.state.NumberofWorkflows}
                  min={0}
                  size={6}
                  style={numericInputStyle}
                  />
              </div>
              <br />
                <label>Instructions</label>
                <br />
                <textarea className="big-text-field" value={this.state.AssignmentActivityData.AA_instructions} onChange={ (event) => {
                    let newData = this.state.AssignmentActivityData;
                    newData.AA_instructions = event.target.value;
                    this.setState({
                      AssignmentActivityData: newData
                    });
                  }}></textarea>
            
              {advancedOptionsToggle}
              <br />
              <br />
              <br />
              <br />
            </div>

          </div>
        </div>
      );
    }
}

export default AssignmentDetailsComponent;
