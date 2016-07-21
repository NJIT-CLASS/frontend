import React from 'react';
import Dropdown from 'react-dropdown';
import NumericInput from 'react-numeric-input';
import Checkbox from '../shared/checkbox';

class ProblemDetailsComponent extends React.Component{
    constructor(props){
      super(props);
      //this.props.:
      //numWorkflows
      // this.props.workflowIndex
      this.state = {
        ShowContent: true
      };
    }



    render(){
      let problemTypeValues=['Essay','Multiple Choice','Short Answer','Computer Program'];

      let multipleWorkflowsView = null;
      if(this.props.NumberofWorkflows > 1){
        multipleWorkflowsView = (<div>
          <div className='inner'>
            <label>Problem Name</label>
            <br />
            <input type="text" placeholder="Name" value={this.props.WorkflowDetails.Name} onChange={this.props.changeWorkflowInputData.bind(this, 'Name', this.props.workflowIndex)}/>
          </div>

          <div className='inner'>
            <label>Problem Type</label>
            <Dropdown options={problemTypeValues}
                      selectedValue={this.props.WorkflowDetails.Type}
                      onChange={this.props.changeWorkflowDropdownData.bind(this,'Type',this.props.workflowIndex)}
                      />
          </div>

            <div className='inner'>
              <label>Problem Documentation </label>
              <br />
              <input type="text" placeholder="Documentation" value={this.props.WorkflowDetails.AA_documentation} onChange={this.props.changeWorkflowInputData.bind(this, 'AA_documentation', this.props.workflowIndex)}/>
            </div>

        </div>
        );
      }


      return (
        <div className="section card-1">
          <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}>Problem Parameters</h2>
          <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>
            <div className='section-divider'>

              {multipleWorkflowsView}

              <div className='inner'>
                <label>How many people per group</label>
                <br />
                <NumericInput min={1}
                              value={this.props.WorkflowDetails.GroupSize}
                              onChange={this.props.changeWorkflowData.bind(this,'GroupSize',this.props.workflowIndex)}/>
              </div>

              <div className='inner'>
                <label>How many problems of this type</label>
                <br />
                  <NumericInput min={1}
                                value={this.props.WorkflowDetails.NumberOfSets}
                                onChange={this.props.changeWorkflowData.bind(this,'NumberOfSets',this.props.workflowIndex)}/>
              </div>

              <div className='inner block'>
                <label>Description</label>
                <br />
                <textarea className="big-text-field" placeholder="Description"
                          value={this.props.WorkflowDetails.Description}
                          onChange={this.props.changeWorkflowInputData.bind(this,"Description",this.props.workflowIndex)} ></textarea>
              </div>

              {/*<div className='inner block'>
                <label>Custom Grade Weights (Equal Otherwise)</label>
                <ul>
                  <li style={{margin: '0px', borderBottom: '0px'}}> <label>Create</label> <input></input></li>
                  <li style={{borderBottom: '0px'}}> <label>Edit</label> <input></input></li>
                  <li style={{borderBottom: '0px'}}> <label>Solve</label> <input></input></li>
                </ul>
            </div>*/}

            </div>
          </div>
        </div>
      );
    }
}

export default ProblemDetailsComponent;
