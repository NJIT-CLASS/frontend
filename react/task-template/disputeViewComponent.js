/* This component will hold the dispute text box input. It will only be shown on a dispute-problem task (activity). It makes
 * GET, POST, and PUT api calls to load, save, and submit data.
 */

import React from 'react';
import request from 'request';

class DisputeViewComponent extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            DisputeTaskData: {
              reason:"",
              grades: {
                FactualGrade:90,
                FactualGradeText: "Excellent"
              }
            },
            GradeCriteria:["Factual","Other"]
        };
    }

    getComponentData() {
        const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/dispute/' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                DisputeTaskData: body.result.disputeTaskData,
                GradeCriteria: body.result.gradeCriteria
            });
        });

    }
    /*  componentWillMount(){
        this.getComponentData();
      }*/

    render(){
      let gradeCriteriaList = this.state.GradeCriteria.map(function(rule, index){
        return (
          <div key={index + 2000}><b>{rule} Grade:   </b>
            <div key={index + 1000} className="faded-small">{this.state.DisputeTaskData.grades[rule + "Grade"]}</div>
            <br />
            <div className="faded-big" key={index} >{this.state.DisputeTaskData.grades[rule + "GradeText"]}
            </div>
            <br />
            <br />
          </div>

        );
      }, this);



      return(
        <div className="section animate fadeInUp">

            <div name="disputeHeader">
              <h2 className="title"> <b>Reasons for Dispute</b> </h2>
            </div>
            <div className="section-content">
            {gradeCriteriaList} <br/>
            <div className="faded-big"  >{this.state.DisputeText}
            </div>
            </div>
        </div>
      );

    }

}

export default DisputeViewComponent;
