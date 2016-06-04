import React from 'react';
import request from 'request';


/*
  PROPS:
  TaskRubric,
  GradeCriteria,
  GradeText,
  GradeNumber,
  handleGradeTextChange()
  handleGradeNumberChange()
  saveData()
  submitData()
*/

class GradingFrameworkComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        ShowRubric : true,

      };
    }
    toggleRubric(){
      const bool = this.state.ShowRubric ? false : true;
      this.setState({
        ShowRubric: bool
      });
    }


    render(){
      let rubric = null;

      let gradeCriteriaList = this.props.GradeCriteria.map(function(rule, index){
        return (
          <div key={index + 2000}><b>{this.props.GradeCriteria[index]} Grade:   </b>
            <input type="text" key={index + 1000} className="number-input" value={this.props.GradeNumber[index]} onChange={this.props.handleGradeNumberChange.bind(this, index)} ></input>
            <br />
            <textarea className="big-text-field" key={index} value={this.props.GradeText[index]} onChange={this.props.handleGradeTextChange.bind(this,index)} placeholder="Type your problem here ...">
            </textarea>
            <br />
            <br />
          </div>

        );
      }, this);


      if(this.state.ShowRubric){
        rubric = (
            <div name="taskRubric" className="regular-text">
              {this.props.TaskRubric}
            </div>

        );
      }

      let rubricButtonText = this.state.ShowRubric ? "Hide Rubric" : "Show Rubric";

      let gradingComp = (
        <div>
            <div >
              <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {rubricButtonText}</button>
              <br />
              {rubric}
              <br />
              {gradeCriteriaList}
              <br />
              <button type="button" onClick={this.props.submitData.bind(this)}><i className="fa fa-check"></i>Submit</button>
              <button type="button" onClick={this.props.saveData.bind(this)}>Save for Later</button>
           </div>

        </div>
      );

      return(
        <div>
          <form name="gradingFramework" role="form" onSubmit={this.props.submitData.bind(this)}>
            <div>
              {gradingComp}

            </div>
            </form>
        </div>

      );


    }




}

export default GradingFrameworkComponent;
