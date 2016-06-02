import React from 'react';
import request from 'request';


import GradingFrameworkComponent from './gradingFrameworkComponent';

class GradeSolutionComponent extends React.Component {
  constructor (props){
    super(props);

    this.state = {
      GradeType:'',
      GradeText:[],
      GradeNumber:[],
      GradeCriteria: [],
      TaskRubric:'',
      GradeError:'',
      ShowRubric: true
    };
  }

  getComponentData(){
    const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/grade/1' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                GradeType: body.result.gradeType,
                GradeText: body.result.gradeText,
                GradeCriteria: body.result.gradeCriteria,
                GradeNumber: body.result.gradeNumber,
                TaskRubric: body.result.taskRubric
            });
        });
  }


  saveData(e){
    e.preventDefault();

    let numCount = 0;
    let textCount = 0;
    let numbersValid = this.state.GradeNumber.map(function(number){
      if (number.length != 0){
        numCount += 1;
      }
    });
    let textsValid = this.state.GradeText.map(function(str){
      if (str.length != 0){
         textCount += 1;
      }
    });

    const numberValid = this.state.GradeNumber.length == numCount ? true: false;
    const textValid = this.state.GradeText.length == textCount ? true : false;



    if(numberValid && textValid){
      const options = {
          method: 'PUT',
          uri: this.props.apiUrl + '/api/taskTemplate/grade/save',
          body: {
              taskID: this.props.TaskID,
              userID: this.props.UserID,
              gradeNumber: this.state.GradeNumber,
              gradeText: this.state.GradeText
          },
          json: true
        };

      request(options, (err, res, body) => { //probably do soemthing with error here
        console.log("Save button fired");
      });

    }
    else{
      return this.setState({
        GradeError: true
      });
    }

  }

  toggleRubric(){
    const bool = this.state.ShowRubric ? false : true;
    console.log("Button toggled: " + bool);
    this.setState({
      ShowRubric: bool
    });
  }

  submitData(e){
    e.preventDefault();
    let numCount = 0;
    let textCount = 0;

    let numbersValid = this.state.GradeNumber.map(function(number){
      if (number.length != 0){
         numCount += 1;
      }
    });
    let textsValid = this.state.GradeText.map(function(str){
      if (str.length != 0){
         textCount += 1;
      }
    });

    const numberValid = this.state.GradeNumber.length == numCount ? true: false;
    const textValid = this.state.GradeText.length == textCount ? true : false;


    if(numberValid && textValid){
      const options = {
          method: 'POST',
          uri: this.props.apiUrl + '/api/taskTemplate/grade/submit',
          body: {
              taskID: this.props.TaskID,
              userID: this.props.UserID,
              gradeNumber: this.state.GradeNumber,
              gradeText: this.state.GradeText
          },
          json: true
        };

      request(options, (err, res, body) => {
        console.log("Submit button fired");
      });
    }
    else{
      return this.setState({
        GradeError: true
      });


    }
  }

  componentWillMount(){
    this.getComponentData();
  }

  handleGradeNumberChange(index, event){
    console.log(event);
    console.log(event.target.value);
    console.log(index);
    let newGradeNumber = this.state.GradeNumber;
    newGradeNumber[index] = event.target.value;
    this.setState({
      GradeError: false,
      GradeNumber: newGradeNumber
    });
  }

  handleGradeTextChange(index,event){
    console.log(event);
    console.log(event.target.value);
    console.log(index);
    let newGradeText = this.state.GradeText;
    newGradeText[index] = event.target.value;
    this.setState({
      GradeError: false,
      GradeText: newGradeText
    });
  }

  render(){

    return (

      <div className="section">

          <div className="title"><b>Grade the Solution</b></div>
          <div className="section-content">

            <GradingFrameworkComponent TaskRubric={this.state.TaskRubric}
                                      GradeCriteria={this.state.GradeCriteria}
                                      GradeText={this.state.GradeText}
                                      GradeNumber={this.state.GradeNumber}
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
