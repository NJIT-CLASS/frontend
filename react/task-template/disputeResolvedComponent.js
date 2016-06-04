/* This component will hold the dispute text box input. It will only be shown on a dispute-problem task (activity). It makes
 * GET, POST, and PUT api calls to load, save, and submit data.
 */

import React from 'react';
import request from 'request';

class DisputeViewComponent extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            DisputeText: "",
            GradeCriteria:["","","",""],
            DisputeGradeNumber:["","","",""],
            DisputeGradeText:["","","",""],
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
                DisputeText: body.result.disputeText,
                GradeCriteria: body.result.gradeCriteria,
                DisputeGradeText: body.result.disputeGradeText,
                DisputeGradeNumber: body.result.DisputeGradeNumber
            });
        });

    }

    render(){
      let gradeCriteriaList = this.state.GradeCriteria.map(function(rule, index){
        return (
          <div key={index + 2000}><b>{this.state.GradeCriteria[index]} Grade:   </b>
            <div key={index + 1000} className="faded-small">{this.state.DisputeGradeNumber[index]}</div>
            <br />
            <div className="faded-big" key={index} >{this.state.DisputeGradeText[index]}
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
