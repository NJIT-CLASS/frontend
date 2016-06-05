import React from 'react';
import request from 'request';

class GradeViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
    };
  }


  render(){


    let gradesList = this.props.GradeNumber.map(function(grade,index){
      return (
        <div key={index + 2000}><b>{this.props.GradeCriteria[index]} Grade:   </b>
          <div key={index + 1000} className="faded-small">{grade}</div>
          <div className="faded-big" key={index} >{this.props.GradeText[index]} </div>
          <br />
          <br />
        </div>

      );
    }, this);

    return(<div className="section animate">
            <h2 className="title"> <b>Grades</b> </h2>
            <div className="section-content">
              <div className="grades">
                {gradesList}
              </div>
            </div>
          </div>);

  }

}
export default GradeViewComponent;
