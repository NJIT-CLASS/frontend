import React from 'react';
import request from 'request';
import GradeViewComponent from './gradeViewComponent';

class GradedComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      GradeNumber: [],
      GradeText:[],
      GradeCriteria: [],
      TaskRubric:''
    };
  }

  getComponentData(){
    const options = {
      method: 'GET',
      uri: this.props.apiUrl + "/api/taskTemplate/grade/1" + this.props.TaskID,
      json:true
    }

    request(options,(err,res,body)=>{
      this.setState({
          GradeNumber: body.result.gradeNumber,
          GradeText: body.result.gradeText,
          GradeCriteria: body.result.gradeCriteria,
          TaskRubric: body.result.taskRubric
      });
    });
  }

  componentWillMount(){
    this.getComponentData();
  }
  render(){

    return(<div className="invisible">

            <GradeViewComponent GradeNumber={this.state.GradeNumber}
                                GradeText={this.state.GradeText}
                                GradeCriteria={this.state.GradeCriteria} />
            <GradeViewComponent GradeNumber={this.state.GradeNumber}
                                GradeText={this.state.GradeText}
                                GradeCriteria={this.state.GradeCriteria} />

            <button type="button" className="dispute"> Dispute Grade </button>
          </div>
        );

  }

}
export default GradedComponent;
