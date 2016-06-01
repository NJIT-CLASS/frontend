/* This component will hold the dispute text box input. It will only be shown on a dispute-problem task (activity). It makes
 * GET, POST, and PUT api calls to load, save, and submit data.
*/

import React from 'react';
import request from 'request';


class DisputeComponent extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            DisputeText: "",
            GradeCriteria:[],
            DisputeGradeNumber:["","","",""],
            DisputeGradeText:["","","",""],
            TaskRubric: '',
            ShowRubric: false,
            DisputeError: false
        };
    }

    getComponentData() {
        const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/dispute/1' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                DisputeText: body.result.userSolution
            });
        });

    }

    getGradeData(){
      const options = {
              method: 'GET',
              uri: this.props.apiUrl + '/api/taskTemplate/grade/1' + this.props.TaskID,
              json: true
          };

          request(options, (err, res, body) => {
              this.setState({
                  GradeCriteria: body.result.gradeCriteria,
                  TaskRubric: body.result.taskRubric
              });
          });
    }

    handleChange(event) {
        this.setState({
            DisputeError: false,
            DisputeText: event.target.value
        });
    }

    toggleRubric(){
      const bool = this.state.ShowRubric ? false : true;
      console.log("Button toggled: " + bool);
      this.setState({
        ShowRubric: bool
      });
    }

    saveData(e) {
        e.preventDefault();

        const inputError = this.state.DisputeText.length == 0 ? true : false;

        if (inputError) {
            return this.setState({
                DisputeError: inputError
            });
        } else {
            const options = {
                method: 'PUT',
                uri: this.props.apiUrl + '/api/taskTemplate/solve/save',
                body: {
                    taskID: this.props.TaskID,
                    userID: this.props.UserID,
                    disputeText: this.state.DisputeText
                },
                json: true
            };

            request(options, (err, res, body) => {
                console.log("Saved");
            });
        }
    }

    submitData(e) {
        e.preventDefault();

        const inputError = this.state.DisputeText.length == 0 ? true : false;

        if (inputError) {
            return this.setState({
                DisputeError: inputError
            });
        } else {
            const options = {
                method: 'POST',
                uri: this.props.apiUrl + '/api/taskTemplate/solve/submit',
                body: {
                    taskID: this.props.TaskID,
                    userID: this.props.UserID,
                    disputeText: this.state.DisputeText
                },
                json: true
            };

            request(options, (err, res, body) => {
                console.log("Submitted");
            });
        }
    }

    componentWillMount() {
        this.getComponentData();
        this.getGradeData();
    }

    handleGradeNumberChange(index, event){
      console.log(event);
      console.log(event.target.value);
      console.log(index);
      let newGradeNumber = this.state.DisputeGradeNumber;
      newGradeNumber[index] = event.target.value;
      this.setState({
        DisputeError: false,
        DisputeGradeNumber: newGradeNumber
      });
    }

    handleGradeTextChange(index,event){
      console.log(event);
      console.log(event.target.value);
      console.log(index);
      let newGradeText = this.state.DisputeGradeText;
      newGradeText[index] = event.target.value;
      this.setState({
        DisputeError: false,
        DisputeGradeText: newGradeText
      });
    }

    render() {
      let rubric = null;

      let gradeCriteriaList = this.state.GradeCriteria.map(function(rule, index){
        return (
          <div key={index + 2000}><b>{this.state.GradeCriteria[index]} Grade:   </b>
            <input type="text" key={index + 1000} className="number-input" value={this.state.DisputeGradeNumber[index]} onChange={this.handleGradeNumberChange.bind(this,index)} ></input>
            <br />
            <textarea className="big-text-field" key={index} value={this.state.DisputeGradeText[index]} onChange={this.handleGradeTextChange.bind(this,index)} placeholder="Type your problem here ...">
            </textarea>
            <br />
            <br />
          </div>

        );
      }, this);


      if(this.state.ShowRubric){
        rubric = (
            <div name="taskRubric" className="regular-text">
              {this.state.TaskRubric}
            </div>

        );
      }

      let rubricButtonText = this.state.ShowRubric ? "Hide Rubric" : "Show Rubric";

      let gradingComp = (

        <div>
            <div className="title"><b>Grade the Solution</b></div>
            <div className="section-content">
              <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {rubricButtonText}</button>
              <br />
              {rubric}
              <br />
              {gradeCriteriaList}
              <br />
           </div>

        </div>
      );

      return(
        <div>
          <form name="disputeProblemTask" role="form" className="section" onSubmit={this.submitData.bind(this)}>
            <div name="disputeHeader">
              <h2 className="title"> <b>Justify your Dispute</b> </h2>
            </div>
            <div className="section-content">
              {gradingComp}
              <br />
              <div className="regular-text"><b>Explain fully why all previous graders were wrong, and your regrading is correct.</b></div>
              <textarea className="big-text-field" value={this.state.DisputeText} onChange={this.handleChange.bind(this)} placeholder="Type your response here ...">
              </textarea>
              <br />
              <button type="submit"><i className="fa fa-check"></i>Submit</button>
              <button type="button" onClick={this.saveData.bind(this)}>Save for Later</button>
           </div>
          </form>
        </div>
      );


    }


}


export default DisputeComponent;
