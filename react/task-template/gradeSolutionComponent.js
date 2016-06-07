import React from 'react';
import request from 'request';

import Modal from '../shared/modal';
import GradingFrameworkComponent from './gradingFrameworkComponent';

class GradeSolutionComponent extends React.Component {
  constructor (props){
    super(props);

    this.state = {
      TaskData:{
                        graders:  [this.props.UserID],
                        gradingCriteria: ["Factual","Other"],
                        8: {
                        }
                      },
      GradeType:'',
      TaskRubric:'',
      GradeError:false,
      ShowRubric: true
    };
  }

  getComponentData(){
    const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/grade/' + this.props.TaskID,
            json: true
        };





    request(options, (err, res, body) => {
        this.setState({
            GradeType: body.result.gradeType,
          TaskData: body.result.taskData,
            TaskRubric: body.result.taskRubric
        });
    });
  }


  saveData(e){
    e.preventDefault();

    let nullCount = 0;
    let validData = false;

    if(this.state.TaskData[this.props.UserID]==null){
      this.setState({
        GradeError: true
      });
      return;
    }

    for(let str in this.state.TaskData[this.props.UserID]){
      if(this.state.TaskData[this.props.UserID][str] == ''){
        nullCount++;
      }
    }

    if(nullCount == 0){
        validData = true;
    }

    if(!validData){
      this.setState({
        GradeError: true
      });
      return;
    }
    const options = {
        method: 'PUT',
        uri: this.props.apiUrl + '/api/taskTemplate/grade/submit',
        body: {
            taskID: this.props.TaskID,
            userID: this.props.UserID,
            taskData: this.state.TaskData
        },
        json: true
      };

      request(options, (err, res, body) => {
      });



  }

  toggleRubric(){
    const bool = this.state.ShowRubric ? false : true;

    this.setState({
      ShowRubric: bool
    });
  }

  submitData(e){
    e.preventDefault();
    let nullCount = 0;
    let validData = false;

    if(this.state.TaskData[this.props.UserID]==null){
      this.setState({
        GradeError: true
      });
      return;
    }

    for(let str in this.state.TaskData[this.props.UserID]){
      if(this.state.TaskData[this.props.UserID][str] == ''){
        nullCount++;
      }
    }

    if(nullCount == 0){
        validData = true;
    }


    if(validData){
      const options = {
          method: 'POST',
          uri: this.props.apiUrl + '/api/taskTemplate/grade/submit',
          body: {
              taskID: this.props.TaskID,
              userID: this.props.UserID,
              taskData: this.state.TaskData
          },
          json: true
        };

      request(options, (err, res, body) => {
      });
    }
    else{
      this.setState({
        GradeError: true
      });
    }
  }

  componentWillMount(){
    this.getComponentData();
  }

  handleGradeNumberChange(index, event){
    if(event.target.value.length > 3 ){
      return;
    }
    let newTaskData = this.state.TaskData;
    let newGradeData = this.state.TaskData[this.props.UserID];
    let indexer = index + "Grade";
    newGradeData[indexer] = event.target.value;
    newTaskData[this.props.UserID] = newGradeData;
    this.setState({
      GradeError: false,
      TaskData: newTaskData
    });
  }

  handleGradeTextChange(index,event){
    let newTaskData = this.state.TaskData;
    let newGradeData= this.state.TaskData[this.props.UserID];
    let indexer = index + "GradeText";
    newGradeData[indexer] = event.target.value;

    newTaskData[this.props.UserID] = newGradeData;
    this.setState({
      GradeError: false,
      TaskData: newTaskData
    });
  }

  modalToggle(){
    this.setState({GradeError: false})
  }

  render(){
    let errorMessage = null;
    if(this.state.GradeError){
      errorMessage = (<Modal title="Submit Error" close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
    }
    return (

      <div className="section animate fadeInUp ">
        {this.state.TaskData[this.props.UserID]["FactualGradeText"]}
          {errorMessage}
          <div className="title"><b>Grade the Solution</b></div>
          <div className="section-content">
            <GradingFrameworkComponent TaskRubric={this.state.TaskRubric}
                                      GradeCriteria={this.state.TaskData.gradingCriteria}
                                      GradeData={this.state.TaskData[this.props.UserID]}
                                      saveData={this.saveData.bind(this)}
                                      submitData={this.submitData.bind(this)}
                                      handleGradeNumberChange={this.handleGradeNumberChange.bind(this)}
                                      handleGradeTextChange={this.handleGradeTextChange.bind(this)}
                                        />
        <br />
        </div>
      </div>
    );
  }

}

export default GradeSolutionComponent;
