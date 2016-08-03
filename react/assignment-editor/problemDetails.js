/* This Component is contains the workflow input fields. It gets its data and functions from the AssignmentEditorContainer.
*/
import React from 'react';
import Dropdown from 'react-dropdown';
import NumberField from '../shared/numberField';
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
            <input type="text" placeholder="Name" value={this.props.WorkflowDetails.WA_name} onChange={this.props.changeWorkflowInputData.bind(this, 'WA_name', this.props.workflowIndex)}/>
          </div>

          <div className='inner'>
            <label>Problem Type</label>
            <Dropdown options={problemTypeValues}
                      selectedValue={this.props.WorkflowDetails.WA_type}
                      onChange={this.props.changeWorkflowDropdownData.bind(this,'WA_type',this.props.workflowIndex)}
                      />
          </div>
          <br />
          <div className='inner block'>
            <label>Description</label>
            <br />
            <textarea className="big-text-field" placeholder="Description"
                      value={this.props.WorkflowDetails.WA_documentation}
                      onChange={this.props.changeWorkflowInputData.bind(this,"WA_documentation",this.props.workflowIndex)} ></textarea>
          </div>

        </div>
        );
      }


      return (
        <div className="section card-1">
          <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}>{this.props.WorkflowDetails.WA_name} Parameters</h2>
          <div className={this.state.ShowContent ? "section-content" : "task-hiding"}>
            <div className='section-divider'>

              {multipleWorkflowsView}

              <div className='inner'>
                <label>How many people per group</label>
                <br />
                <NumberField min={1}
                              max={25}
                              value={this.props.WorkflowDetails.WA_default_group_size}
                              onChange={this.props.changeWorkflowData.bind(this,'WA_default_group_size',this.props.workflowIndex)}/>
              </div>

              <div className='inner'>
                <label>How many problems of this type</label>
                <br />
                  <NumberField min={1}
                                max={20}
                                value={this.props.WorkflowDetails.WA_number_of_sets}
                                onChange={this.props.changeWorkflowData.bind(this,'WA_number_of_sets',this.props.workflowIndex)}/>
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
