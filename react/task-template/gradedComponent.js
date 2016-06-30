/* This Component is an invisible container holding a bunch of GradeView Components.
* It has a GET method that gets the apporpriate data and feeds it to the GradeViewComponents.
* This is shown after all grades have been submitted.
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
        Error: false
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
