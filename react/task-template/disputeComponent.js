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
            DisputeTaskData:{
              reason:"",
              grades: {
                FactualGrade:90
              }
            },
            GradeTaskData: {
                              graders:  [this.props.UserID, 1],
                              gradingCriteria: ["Factual","Other"],
                              8: {
                                  FactualGrade: 78,
                                  FactualGradeText: "Hi"
                              },
                              1:{
                                FactualGrade: 78,
                                FactualGradeText: "Hi"
                              }
                            },
            TaskRubric: '',
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
                DisputeTaskData: body.result.disputeTaskData,
                GradeTaskData: body.result.gradeTaskData,

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
    /*  componentWillMount(){
        this.getComponentData();
        this.getGradeData();
      }*/

    handleChange(event) {
      let newTaskData = this.state.DisputeTaskData;
      newTaskData.reason = event.target.value;
        this.setState({
            DisputeError: false,
            DisputeTaskData: newTaskData
        });
    }


    saveData(e) {
        e.preventDefault();

        if (this.state.DisputeTaskData.reason == null) {
            this.setState({
                DisputeError: true
            });
            return;
        }

        let nullCount = 0;
        let validData = false;

        if(this.state.DisputeTaskData.grades == null){
          this.setState({
            DisputeError: true
          });
          return;
        }

        for(let str in this.state.DisputeTaskData["grades"]){
          if(this.state.DisputeTaskData["grades"][str] == ''){
            nullCount++;
          }
        }

        if(nullCount == 0){
            validData = true;
        }


        if(validData){
        const options = {
            method: 'PUT',
            uri: this.props.apiUrl + '/api/taskTemplate/solve/save',
            body: {
                taskID: this.props.TaskID,
                userID: this.props.UserID,
                disputeTaskData: this.state.DisputeTaskData
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
        return;

      }

    }

    submitData(e) {
        e.preventDefault();

        if (this.state.DisputeTaskData.reason == null) {
            this.setState({
                DisputeError: true
            });
            return;
        }

        let nullCount = 0;
        let validData = false;

        if(this.state.DisputeTaskData.grades == null){
          this.setState({
            DisputeError: true
          });
          return;
        }

        for(let str in this.state.DisputeTaskData.grades){
          if(this.state.DisputeTaskData.grades[str] == ''){
            nullCount++;
          }
        }

        if(nullCount == 0){
            validData = true;
        }

        if(validData){
            const options = {
                method: 'POST',
                uri: this.props.apiUrl + '/api/taskTemplate/solve/submit',
                body: {
                    taskID: this.props.TaskID,
                    userID: this.props.UserID,
                    disputeTaskData: this.state.DisputeTaskData
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
          return;
        }
    }


    handleGradeNumberChange(index, event){
      if(event.target.value.length > 3 ){
        return;
      }

      let newTaskData = this.state.DisputeTaskData;
      let indexer = index + "Grade";
      newTaskData["grades"][indexer] = event.target.value;
      this.setState({
        DisputeError: false,
        DisputeTaskData: newTaskData
      });
    }

    handleGradeTextChange(index,event){
      let newTaskData = this.state.DisputeTaskData;
      let indexer = index + "GradeText";
      newTaskData["grades"][indexer] = event.target.value;

      this.setState({
        DisputeError: false,
        DisputeTaskData: newTaskData
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


      return(
        <div className="section animate fadeInUp">
          {errorMessage}
            <div name="disputeHeader">
              <h2 className="title"> <b>Justify your Dispute</b> </h2>
            </div>
            <div className="section-content">
              <form name="disputeProblemTask" role="form">
                <div className="regular-text"><b>Explain fully why all previous graders were wrong, and your regrading is correct.</b></div>
                <textarea className="big-text-field" value={this.state.DisputeTaskData.reason} onChange={this.handleChange.bind(this)} placeholder="Type your response here ...">
                </textarea>
              </form>
              <br />
              <GradingFrameworkComponent TaskRubric={this.state.TaskRubric}
                                        GradeCriteria={this.state.GradeTaskData.gradingCriteria}
                                        GradeData={this.state.DisputeTaskData.grades}
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
