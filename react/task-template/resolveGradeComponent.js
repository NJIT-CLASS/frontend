import React from 'react';
import request from 'request';

import GradingFrameworkComponent from './gradingFrameworkComponent';
import Modal from '../shared/modal';

class ResolveGradeComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            GradeType: '',
            ResolutionGradeText: [],
            ResolutionGradeNumber: [],
            TaskRubric: "",
            ShowRubric: true,
            GradeCriteria: [],
            ResolutionError:''
        };
    }
    getComponentData() {
        const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/resolve/' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({GradeType: body.result.gradeType, ResolutionGradeText: body.result.gradeText, GradeCriteria: body.result.gradeCriteria, ResolutionGradeNumber: body.result.gradeNumber, TaskRubric: body.result.taskRubric});
        });
    }

    saveData(e) {
        e.preventDefault();

        if(this.state.ResolutionGradeText == null || this.state.ResolutionGradeNumber == null){
          this.setState({
            ResolutionError: true
          });
          return;
        }

        const options = {
            method: 'PUT',
            uri: this.props.apiUrl + '/api/taskTemplate/resolve/save',
            body: {
                taskID: this.props.TaskID,
                userID: this.props.UserID,
                gradeNumber: this.state.ResolutionGradeNumber,
                gradeText: this.state.ResolutionGradeText
            },
            json: true
        };

        request(options, (err, res, body) => {
        });



    }

    toggleRubric() {
        const bool = this.state.ShowRubric
            ? false
            : true;
        this.setState({ShowRubric: bool});
    }

    submitData(e) {
      e.preventDefault();

      if(this.state.ResolutionGradeText == null || this.state.ResolutionGradeNumber == null){
        this.setState({
          ResolutionError: true
        });
        return;
      }

      let numCount = 0;
      let textCount = 0;
      let numbersValid = this.state.ResolutionGradeNumber.map(function(number) {
          if (number.length != 0) {
              numCount += 1;
          }
      });
      let textsValid = this.state.ResolutionGradeText.map(function(str) {
          if (str.length != 0) {
              textCount += 1;
          }
      });

      const numberValid = this.state.ResolutionGradeNumber.length == numCount
          ? true
          : false;
      const textValid = this.state.ResolutionGradeText.length == textCount
          ? true
          : false;

      if (numberValid && textValid) {
          const options = {
              method: 'POST',
              uri: this.props.apiUrl + '/api/taskTemplate/resolve/submit',
              body: {
                  taskID: this.props.TaskID,
                  userID: this.props.UserID,
                  gradeNumber: this.state.ResolutionGradeNumber,
                  gradeText: this.state.ResolutionGradeText
              },
              json: true
          };

          request(options, (err, res, body) => {
          });

      } else {
          this.setState({
            ResolutionError: true
          });
          return;
      }


    }

    componentWillMount() {
        this.getComponentData();
    }

    handleGradeNumberChange(index, event){
      let newGradeNumber = this.state.ResolutionGradeNumber;
      newGradeNumber[index] = event.target.value;
      this.setState({
        ResolutionError: false,
        ResolutionGradeNumber: newGradeNumber
      });
    }

    handleGradeTextChange(index,event){
      let newGradeText = this.state.ResolutionGradeText;
      newGradeText[index] = event.target.value;
      this.setState({
        ResolutionError: false,
        ResolutionGradeText: newGradeText
      });
    }

    modalToggle(){
      this.setState({ResolutionError: false})
    }
    render() {
      let errorMessage = null;
      if(this.state.ResolutionError){
        errorMessage = (<Modal title="Submit Error" close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
      }
        return (
            <div className="section animate fadeInDown">
              {errorMessage}
                <div className="title">
                    <h2>Resolution Grade</h2>
                </div>
                <div className="section-content">
                    <GradingFrameworkComponent GradeText={this.state.ResolutionGradeText}
                                                GradeNumber={this.state.ResolutionGradeNumber}
                                                GradeCriteria={this.state.GradeCriteria}
                                                TaskRubric={this.state.TaskRubric}
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

export default ResolveGradeComponent;
