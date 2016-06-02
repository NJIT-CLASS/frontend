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
    let tableStyle = {
      backfaceVisibility: 'hidden'
    }
    return(<div className="invisible">
            <table border="0" cellPadding="0" cellSpacing="0" className="tab">
              <tbody>
                    <tr>
                    <td style={tableStyle}> <GradeViewComponent GradeNumber={this.state.GradeNumber}
                                            GradeText={this.state.GradeText}
                                            GradeCriteria={this.state.GradeCriteria}   />
                    </td>
                    <td>
                       <GradeViewComponent GradeNumber={this.state.GradeNumber}
                                            GradeText={this.state.GradeText}
                                            GradeCriteria={this.state.GradeCriteria}  />
                    </td>
                    <td>
                      <GradeViewComponent GradeNumber={this.state.GradeNumber}
                                            GradeText={this.state.GradeText}
                                            GradeCriteria={this.state.GradeCriteria} />
                    </td>
                    </tr>
                    <tr>
                      <td></td><td></td><td><button type="button" className="dispute"> Dispute Grade </button></td>
                    </tr>
              </tbody>
            </table>
          </div>
        );

  }

}
export default GradedComponent;
