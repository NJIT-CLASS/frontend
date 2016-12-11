/* This Component is an invisible container holding a bunch of SuperViewComponents
* It is used because there are usually multiple graders, and this Componentshows them side by side
* This is shown after all grades have been submitted.
* NOTE: Will probably need to rework this to make compatible with any task that has mutliple partcipants(number-of_participants > 1),
        since now any task can have multiple partcipants
*/

import React from 'react';
import request from 'request';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../../server/utils/constants';
import ErrorComponent from './errorComponent';
import SuperViewComponent from './superViewComponent';

class MutliViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      TaskStatus:"",
      HideDisputeButton: this.props.HideDisputeButton ? true: false,
      Error:false
    };
  }

  componentWillMount(){
    if(!this.props.UsersTaskData){
      this.setState({
        Error: true
      });
    }

      let tstat = (this.props.TaskStatus != null) ? this.props.TaskStatus : "Incomplete";
      this.setState({
          TaskStatus: tstat
      });
  }

  render(){
    let gradesView = null;
    let tableStyle = {
      backfaceVisibility: 'hidden'
    }
    let disputeButton = (<button type="button" className="dispute animate fadeInUp" onClick={()=>{location.href = '/task/'+ TASK_TYPES.DISPUTE+'/'+this.props.TaskID}}> Dispute Grade </button>);
    if(this.state.HideDisputeButton || this.state.TaskStatus == "Complete"){
      disputeButton=null;
    }

    console.log("In multiViewComponent:", this.props.UsersTaskData)


    if( !this.state.Error){
      gradesView = this.props.UsersTaskData.map(function(task, index){
        let compString = null;

        switch (task.TaskActivity.Type) {
            case TASK_TYPES.CREATE_PROBLEM:
                compString = "Create the Problem";
                break;
            case TASK_TYPES.EDIT:
                compString = "Edit the Problem";
                break;
            case TASK_TYPES.SOLVE_PROBLEM:
                compString = "Solve the Problem";
                break;
            case TASK_TYPES.GRADE_PROBLEM:
                compString = "Grade the Solution";
                break;
            case TASK_TYPES.CONSOLIDATION:
                compString = "Consolidate the Grades";
                break;
            case TASK_TYPES.DISPUTE:
                compString = "Dispute Your Grade";
                break;
            case TASK_TYPES.RESOLVE_DISPUTE:
                compString = "Resolve the Dispute";
                break;
            default:
                compString = "";
                break;
        }


          return(
            <div className="child" key={index +500}>
              <SuperViewComponent key={index + 2000} index={index}
                ComponentTitle={compString} 
                TaskData={task.Data}
                Instructions={task.TaskActivity.Instructions}
                Rubric={task.TaskActivity.Rubric}
                TaskActivityFields={task.TaskActivity.Fields}/>
          </div>
          );
      }, this);
  }

  else{
    return(<ErrorComponent />);
  }

  return(<div>
          <div className="multi-view-container animate fadeInUp">
            {gradesView}

            <br />

          </div>
          {disputeButton}
        </div>
      );

  }

}
export default MutliViewComponent;
