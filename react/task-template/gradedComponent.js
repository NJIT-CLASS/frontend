import React from 'react';
import request from 'request';

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

    let gradesList = this.state.GradeNumber.map(function(grade,index){
      return (
        <div key={index + 2000}><b>{this.state.GradeCriteria[index]} Grade:   </b>
          <div key={index + 1000} className="faded-small">{grade}</div>
          <div className="faded-big" key={index} >{this.state.GradeText[index]} </div>
          <br />
          <br />
        </div>

      );
    },this);
    return(<div className="section">
            <h2 className="title"> <b>Grades</b> </h2>
            <div className="section-content">
              <div className="grades">
                {gradesList}
              </div>
              <button type="button" className="dispute"> Dispute Grade </button>
            </div>
          </div>);

  }

}
export default GradedComponent;
