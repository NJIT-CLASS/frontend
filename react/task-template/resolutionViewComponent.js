
import React from 'react';
import request from 'request';

class ResolutionViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      ResolveTaskData: {
        grades: {
          FactualGrade:90,
          FactualGradeText: "Excellent"
        }
      },
      GradeCriteria: ["Factual","Other"],
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
          ResolveTaskData: body.result.resolveTaskData,
          GradeCriteria: body.result.gradeCriteria,
          TaskRubric: body.result.taskRubric
      });
    });
  }

/*  componentWillMount(){
    this.getComponentData();
  } */
  render(){
    let gradesList = this.state.GradeCriteria.map(function(rule,index){
      return (
        <div key={index + 2000}><b>{rule} Grade:   </b>
          <div key={index + 1000} className="faded-small">{this.state.ResolveTaskData.grades[rule + "Grade"]}</div>
          <div className="faded-big" key={index} >{this.state.ResolveTaskData.grades[rule + "GradeText"]} </div>
          <br />
          <br />
        </div>

      );
    }, this);

    return(<div className="section animate fadeInUp">
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
