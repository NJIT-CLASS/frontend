
import React from 'react';
import request from 'request';

class ResolutionViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      ResolutionGradeNumber: [],
      ResolutionGradeText:[],
      GradeCriteria: [],
      TaskRubric:''
    };
  }

  getComponentData(){
    const options = {
      method: 'GET',
      uri: this.props.apiUrl + "/api/taskTemplate/resolve/" + this.props.TaskID,
      json:true
    }

    request(options,(err,res,body)=>{
      this.setState({
          ResolutionGradeNumber: body.result.gradeNumber,
          ResolutionGradeText: body.result.gradeText,
          GradeCriteria: body.result.gradeCriteria,
          TaskRubric: body.result.taskRubric
      });
    });
  }

  componentWillMount(){
    this.getComponentData();
  }
  render(){
    let gradesList = this.state.ResolutionGradeNumber.map(function(grade,index){
      return (
        <div key={index + 2000}><b>{this.state.GradeCriteria[index]} Grade:   </b>
          <div key={index + 1000} className="faded-small">{grade}</div>
          <div className="faded-big" key={index} >{this.state.ResolutionGradeText[index]} </div>
          <br />
          <br />
        </div>

      );
    }, this);

    return(<div className="section">
            <h2 className="title"> <b>Resolution Grades</b> </h2>
            <div className="section-content">
              <div className="resoltuionGrades">
                {gradesList}
              </div>
            </div>
          </div>);
  }

}
export default ResolutionViewComponent;
