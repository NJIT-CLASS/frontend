import React from 'react';
import request from 'request';


/*
  PROPS:
  TaskRubric,
  GradingCriteria,
  GradingText,
  GradingNumber,
*/

class GradingFramework extends React.Component{
    constructor(){
      super(props);
      this.state = {
        ShowRubric = true,

      };
    }

    handleGradeTextChange(){
      this.props.handleGradeTextChange().bind(this);
    }

    handleGradeNumberChange(){
      this.props.handleGradeNumberChange().bind(this);
    }

    toggleRubric(){
      const bool = this.state.ShowRubric ? false : true;
      console.log("Button toggled: " + bool);
      this.setState({
        ShowRubric: bool
      });
    }


    render(){
      let rubric = null;

      let gradeCriteriaList = this.props.GradeCriteria.map(function(rule, index){
        return (
          <div key={index + 2000}><b>{this.props.GradeCriteria[index]} Grade:   </b>
            <input type="text" key={index + 1000} className="number-input" value={this.props.GradeNumber[index]} onChange={this.handleGradeNumberChange.bind(this,index)} ></input>
            <br />
            <textarea className="big-text-field" key={index} value={this.props.GradeText[index]} onChange={this.handleGradeTextChange.bind(this,index)} placeholder="Type your problem here ...">
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
            <div className="title"><b>Grade the Solution</b></div>
            <div className="section-content">
              <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {rubricButtonText}</button>
              <br />
              {rubric}
              <br />
              {gradeCriteriaList}
              <br />
           </div>

        </div>
      );

      return(
        <div>
          <form name="gradingFramework" role="form" onSubmit={this.submitData.bind(this)}>
            <div name="disputeHeader">
              <h2 className="title"> <b>Justify your Dispute</b> </h2>
            </div>
            <div className="section-content">
              {gradingComp}

      );


    }
}
