/* This Component is an invisible container holding a bunch of SuperViewComponents
* It is used because there are usually multiple graders, and this Componentshows them side by side
* This is shown after all grades have been submitted.
* NOTE: Will probably need to rework this to make compatible with any task that has mutliple partcipants(number-of_participants > 1),
        since now any task can have multiple partcipants
*/

import React from 'react';
import request from 'request';
import { TASK_TYPES , TASK_TYPE_TEXT } from '../shared/constants';
import ErrorComponent from './errorComponent';
import SuperViewComponent from './superViewComponent';
import GradeViewComponent from './gradeViewComponent';

class GradedComponent extends React.Component {
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
    let divPadding = [];
    let tableStyle = {
      backfaceVisibility: 'hidden'
    }
    let disputeButton = (<button type="button" className="dispute animate fadeInUp" onClick={()=>{location.href = '/task/'+ TASK_TYPES.DISPUTE+'/'+this.props.TaskID}}> Dispute Grade </button>);
    if(this.state.HideDisputeButton || this.state.TaskStatus == "Complete"){
      disputeButton=null;
    }

    if( !this.state.Error){

      this.state.UsersTaskData.forEach(function(){
        divPadding.push((<td></td>));
      });

      gradesView = this.state.UsersTaskData.map(function(grader, index){
          return(
            <td key={index +500}>
              <SuperViewComponent
                                    ComponentTitle="Grade"
                                    TaskData={grader[0]}
                                    TaskActivityFields={grader[1]}/>
            </td>
          );
      }, this);
      divPadding.pop();
  }

  else{
    return(<ErrorComponent />);
  }

  return(<div className="invisible animate fadeInUp">
          <table border="0" cellPadding="0" cellSpacing="0" className="tab">
            <tbody>
                  <tr>
                  {gradesView}
                  </tr>
                  <tr>
                    {divPadding} <td>{disputeButton}</td>
                  </tr>
            </tbody>
          </table>
        </div>
      );

  }

}
export default GradedComponent;
