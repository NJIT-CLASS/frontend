/* This component will hold the dispute text box input. It will only be shown on a dispute-problem task (activity). It makes
 * GET, POST, and PUT api calls to load, save, and submit data.
*/

import React from 'react';
import request from 'request';

import GradingFrameworkComponent from './gradingFrameworkComponent';
import Modal from '../shared/modal';


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
            uri: this.props.apiUrl + '/api/taskTemplate/dispute/' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                DisputeText: body.result.disputeText,
                DisputeNumber: body.result.disputeNumber,
                GradeCriteria: body.result.gradeCriteria
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
      this.setState({
        ShowRubric: bool
      });
    }

    saveData(e) {
        e.preventDefault();


        if (this.state.DisputeText == null || this.state.DisputeGradeText == null || this.state.DisputeGradeNumber == null) {
            this.setState({
                DisputeError: true
            });
            return;
        }
        const options = {
            method: 'PUT',
            uri: this.props.apiUrl + '/api/taskTemplate/solve/save',
            body: {
                taskID: this.props.TaskID,
                userID: this.props.UserID,
                disputeText: this.state.DisputeText,
                disputeGradeText:this.state.DisputeGradeText,
                disputeGradeNumber: this.state.DisputeGradeNumber
            },
            json: true
        };

        request(options, (err, res, body) => {
        });

    }

    submitData(e) {
        e.preventDefault();

        if (this.state.DisputeText == null || this.state.DisputeGradeText == null || this.state.DisputeGradeNumber == null) {
            this.setState({
                DisputeError: true
            });
            return;
        }

        const disputeTextValid = this.state.DisputeText.length == 0 ? false : true;


        let numCount = 0;
        let textCount = 0;

        let numbersValid = this.state.DisputeGradeNumber.map(function(number){
          if (number.length != 0){
             numCount += 1;
          }
        });
        let textsValid = this.state.DisputeGradeText.map(function(str){
          if (str.length != 0){
             textCount += 1;
          }
        });

        const numberValid = this.state.DisputeGradeNumber.length == numCount ? true: false;
        const textValid = this.state.DisputeGradeText.length == textCount ? true : false;


        if(numberValid && textValid && disputeTextValid){
            const options = {
                method: 'POST',
                uri: this.props.apiUrl + '/api/taskTemplate/solve/submit',
                body: {
                    taskID: this.props.TaskID,
                    userID: this.props.UserID,
                    disputeText: this.state.DisputeText,
                    disputeGradeText:this.state.DisputeGradeText,
                    disputeGradeNumber: this.state.DisputeGradeNumber
                },
                json: true
            };

            request(options, (err, res, body) => {
            });
        }
        else{
          this.setState({
              DisputeError: true
          });
          return
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

    modalToggle(){
      this.setState({DisputeError: false})
    }

    render() {
      let errorMessage = null;
      if(this.state.DisputeError){
        errorMessage = (<Modal title="Submit Error" close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
      }

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
        <div className="section animate fadeInUp">
          {errorMessage}
            <div name="disputeHeader">
              <h2 className="title"> <b>Justify your Dispute</b> </h2>
            </div>
            <div className="section-content">
              <form name="disputeProblemTask" role="form">
                <div className="regular-text"><b>Explain fully why all previous graders were wrong, and your regrading is correct.</b></div>
                <textarea className="big-text-field" value={this.state.DisputeText} onChange={this.handleChange.bind(this)} placeholder="Type your response here ...">
                </textarea>
              </form>
              <br />
              <GradingFrameworkComponent TaskRubric={this.state.TaskRubric}
                                        GradeCriteria={this.state.GradeCriteria}
                                        GradeText={this.state.DisputeGradeText}
                                        GradeNumber={this.state.DisputeGradeNumber}
                                        saveData={this.saveData.bind(this)}
                                        submitData={this.submitData.bind(this)}
                                        handleGradeNumberChange={this.handleGradeNumberChange.bind(this)}
                                        handleGradeTextChange={this.handleGradeTextChange.bind(this)}
                                        />
              </div>
        </div>
      );


    }


}


export default DisputeComponent;
