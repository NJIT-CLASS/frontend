/* This Component is an invisible container holding a bunch of GradeView Components.
* It has a GET method that gets the apporpriate data and feeds it to the GradeViewComponents.
* This is shown after all grades have been submitted.
*/

import React from 'react';
import request from 'request';
import ErrorComponent from './errorComponent';
import SuperViewComponent from './superViewComponent';
import GradeViewComponent from './gradeViewComponent';

class ConsolidateComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      UsersTaskData: [], //props
      TaskActivityFields: {}, //props
      ComponentTitles:"",
      TaskStatus:"",
      HideDisputeButton: this.props.HideDisputeButton ? true: false,
      Error:false
    };
  }

  componentWillMount(){
    if(!this.props.UsersTaskData){
      this.setState({
        Error: false
      });
    }

      let tstat = (this.props.TaskStatus != null) ? this.props.TaskStatus : "Complete";
      this.setState({
          TaskStatus: tstat
      });
  }

  render(){
    let gradesView = null;
    let divPadding = [];
    let tableStyle = {
      backfaceVisibility: 'hidden'
    }


    if( this.state.Error){
        return(<ErrorComponent />);

  }


  return(<div className="invisible animate fadeInUp">

          

          <SuperComponent         TaskID = {this.props.TaskID}
                                  UserID = {this.props.UserID}
                                  ComponentTitle="Consolidate the Grades"
                                  TaskData = {this.state.Data['grade'][0]}
                                  TaskActivityFields = {this.state.Data['grade'][1]}
                                  AssignmentDescription = {this.state.Data['grade'][2]}
                                  Instructions = {this.state.Data['grade'][3]}
                                  Rubric= {this.state.Data['grade'][4]}
                                  apiUrl={this.props.apiUrl}
                                  />

        </div>
      );

  }

}
export default ConsolidateComponent;
