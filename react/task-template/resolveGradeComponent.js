import React from 'react';
import request from 'request';

import GradingFrameworkComponent from './gradingFrameworkComponent';
import Modal from '../shared/modal';

class ResolveGradeComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = { //change to GradeTaskData, DisputeTaskData,ResolveTaskData
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
          ResolveTaskData:{
            grades: {
              FactualGrade:90,
              FactualGradeText: "Excellent"
            }
          },
            GradeType: '',
            TaskRubric: "",
            ShowRubric: true,
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
            this.setState({
                          GradeTaskData: body.result.gradeTaskData,
                          DisputeTaskData: body.result.disputeTaskData,
                          ResolveTaskData: body.result.ResolveTaskData,
                          TaskRubric: body.result.taskRubric});
        });
    }

    saveData(e) {
        e.preventDefault();

        if(this.state.ResolveTaskData == null){
          this.setState({
            ResolutionError: true
          });
          return;
        }


        let nullCount = 0;
        let validData = false;

        if(this.state.ResolveTaskData.grades == null){
          this.setState({
            ResolutionError: true
          });
          return;
        }

        for(let str in this.state.ResolveTaskData["grades"]){
          if(this.state.ResolveTaskData["grades"][str] == ''){
            nullCount++;
          }
        }

        if(nullCount == 0){
            validData = true;
        }


        if(validData){
          const options = {
              method: 'PUT',
              uri: this.props.apiUrl + '/api/taskTemplate/resolve/save',
              body: {
                  taskID: this.props.TaskID,
                  userID: this.props.UserID,
                  resolveTaskData: this.state.ResolveTaskData
              },
              json: true
          };

          request(options, (err, res, body) => {
          });
        } else{
          this.setState({
            ResolutionError: true
          });
        }

    }


    submitData(e) {
      e.preventDefault();

      if(this.state.ResolveTaskData == null){
        this.setState({
          ResolutionError: true
        });
        return;
      }


      let nullCount = 0;
      let validData = false;

      if(this.state.ResolveTaskData.grades == null){
        this.setState({
          ResolutionError: true
        });
        return;
      }

      for(let str in this.state.ResolveTaskData.grades){
        if(this.state.ResolveTaskData.grades[str] == ''){
          nullCount++;
        }
      }

      if(nullCount == 0){
          validData = true;
      }


      if(validData){
          const options = {
              method: 'POST',
              uri: this.props.apiUrl + '/api/taskTemplate/resolve/submit',
              body: {
                  taskID: this.props.TaskID,
                  userID: this.props.UserID,
                  resolveTaskData: this.state.ResolveTaskData
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

    /*componentWillMount() {
        this.getComponentData();
    }*/

    handleGradeNumberChange(index, event){
      if(event.target.value.length > 3 ){
        return;
      }
      let newTaskData = this.state.ResolveTaskData;
      newTaskData["grades"][index+"Grade"] = event.target.value;

      this.setState({
        ResolutionError: false,
        ResolveTaskData: newTaskData
      });
    }

    handleGradeTextChange(index,event){
      let newTaskData = this.state.ResolveTaskData;
      newTaskData["grades"][index+"GradeText"] = event.target.value;

      this.setState({
        ResolutionError: false,
        ResolveTaskData: newTaskData
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
                    <GradingFrameworkComponent  GradeData={this.state.ResolveTaskData.grades}
                                                GradeCriteria={this.state.GradeTaskData.gradingCriteria}
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
