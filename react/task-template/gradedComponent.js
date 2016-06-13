/* This Component is an invisible container holding a bunch of GradeView Components.
* It has a GET method that gets the apporpriate data and feeds it to the GradeViewComponents.
* This is shown after all grades have been submitted.
*/

import React from 'react';
import request from 'request';
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
      HideDisputeButton: this.props.HideDisputeButton ? true: false
    };
  }

  componentWillMount(){

  }

  render(){
    let gradesView = null;
    let tableStyle = {
      backfaceVisibility: 'hidden'
    }
    let disputeButton = (<button type="button" className="dispute animate fadeInUp" onClick={()=>{location.href = '/task/dispute/'+this.props.TaskID}}> Dispute Grade </button>);
    if(this.state.HideDisputeButton){
      disputeButton=null;
    }

    let divPadding = [];
    this.state.GradeTaskData.graders.forEach(function(){
      divPadding.push((<td></td>));
    });

    if( this.state.GradeTaskData != {}){
      gradesView = this.state.GradeTaskData.graders.map(function(grader, index){
          return(
            <td key={index +500}>
              <GradeViewComponent     key={grader}
                                      GradeData={this.state.GradeTaskData[grader]}
                                      GradeCriteria={this.state.GradeTaskData.gradingCriteria}   />
            </td>
          );
      }, this);
      divPadding.pop();
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
