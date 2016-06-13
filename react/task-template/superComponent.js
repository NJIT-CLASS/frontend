/* This component is show when the tasks is to create the problem. It will show
* the assignment description, the rubric, the instructions, and a text area. The
* component will be able to make a PUT request to save the data for later, a GET
* request to get the initial data, and a POST request for final submission.
*/
import React from 'react';
import request from 'request';
import Modal from '../shared/modal';
import ErrorComponent from './errorComponent';
import Rater from 'react-rater';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class SuperComponent extends React.Component {
  constructor (props){
    super(props);
    /*
    PROPS:  -TaskData
            -TaskActivityFields (TaskAcitivtyData)
            -ComponentTitle
            -AssignmentDescription
            -Instructions
            -Rubric

    */

    this.state = {
      TaskActivityFields: {
        field_titles: []
      },
      TaskData: {

      },
      ShowRubric: false,
      FieldRubrics: [],
      InputError: false,
      ShowContent: true,
      Error: false
    };
  }

    getComponentData () {
    /*  const options = {
              method: 'GET',
              uri: this.props.apiUrl + '/api/taskTemplate/create/' + this.props.TaskID,
              json: true
          };

      request(options, (err, res, body) => {*/
      let tdata = this.props.TaskData;
      let tAdata = this.props.TaskActivityFields;

      if(!tdata || !tAdata){
        this.setState({Error: true});
        return;
      }

      if(tdata.constructor !== Object){
        tdata = JSON.parse(this.props.TaskData)
      }
      if(tAdata.constructor !== Object){
        tAdata = JSON.parse(this.props.TaskActivityFields)
      }

      if(Object.keys(tAdata).length === 0 && tAdata.constructor === Object){
        this.setState({Error: true});
        return;
      }

      if(Object.keys(tdata).length === 0 && tdata.constructor === Object || tdata == null){
          tdata.number_of_fields = tAdata.number_of_fields;
          for(let i = 0; i < tAdata.number_of_fields; i++){

            tdata[i] = tAdata[i].default_content;
          }
          /*tAdata.field_titles.forEach(function(title){
            tdata[title] = tAdata[title].default_content;
          });*/

      }


      this.setState({
          TaskData: tdata,
          TaskActivityFields: tAdata
      });
      //});
    }

    componentWillMount(){
      this.getComponentData();
    }

    isValidData(){

      for(let i = 0; i < this.state.TaskActivityFields.number_of_fields; i++){
        if(this.state.TaskActivityFields[i].requires_justification){
          if((this.state.TaskData[i][0] == null || this.state.TaskData[i][0] == '') || (this.state.TaskData[i][1] == null || this.state.TaskData[i][1] == '')){
            return false;
          }
        }
        else{
          if(this.state.TaskData[i][0] == null || this.state.TaskData[i][0] == ''){
            return false;
          }
        }

      }

      return true;
    }

    saveData(e){

      e.preventDefault();
      let validData = this.isValidData();


      /*this.state.TaskActivityFields.field_titles.forEach(function(title){

        if(this.state.TaskActivityFields[title].requires_justification){
          if((this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '' || this.state.TaskData[title][0] == 0 ) || (this.state.TaskData[title][1] == null || this.state.TaskData[title][1] == '' || this.state.TaskData[title][1] == 0)){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }

      }
        else {
          if(this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '' || this.state.TaskData[title][0] == 0){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }
        }

      },this);
      */

      if(validData){
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/taskTemplate/create/save',
            body: {
                taskid: this.props.TaskID,
                userid: this.props.UserID,
                taskData: this.state.TaskData
            },
            json: true
          };

        request(options, (err, res, body) => {
          if(res.statusCode != 200){
            this.setState({InputError: true});
            return;
          }
        });
      }
      else{
        this.setState({InputError: true});
        return;
      }
    }

    submitData(e){
      e.preventDefault();
      let validData = this.isValidData();

      if(validData){
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/taskTemplate/create/submit',
            body: {
                taskid: this.props.TaskID,
                userid: this.props.UserID,
                taskData: this.state.TaskData
            },
            json: true
          };

        request(options, (err, res, body) => {
          //chekc error status
        });
      }

      else{
        this.setState({InputError: true});
        return;
      }

    }


    modalToggle(){
      this.setState({InputError:false})
    }

    toggleRubric(){
      const bool = this.state.ShowRubric ? false : true;

      this.setState({
        ShowRubric: bool
      });
    }
    toggleContent(){
      const bool = this.state.ShowContent ? false : true;

      this.setState({
        ShowContent: bool
      });
    }

    handleContentChange(index,event) {
      if(this.state.TaskActivityFields[index] != null && this.state.TaskActivityFields[index].input_type == "numeric"){
          if(isNaN(event.target.value)){
            return;
          }
          if(event.target.value < this.state.TaskActivityFields[index].grade_min || event.target.value > this.state.TaskActivityFields[index].grade_max){
              return;
          }
        }

      let newTaskData = this.state.TaskData;
      newTaskData[index][0] = event.target.value;
      this.setState({
          TaskData: newTaskData
        });
      }

      handleJustificationChange(index,event) {
        let newTaskData = this.state.TaskData;
        newTaskData[index][1] = event.target.value;

        this.setState({
          TaskData: newTaskData
        });
        }

    handleStarChange(index,value){
      let newTaskData = this.state.TaskData;
      newTaskData[index][0] = value;

      this.setState({
        TaskData: newTaskData
      });

    }

    toggleFieldRubric(index){
          if(this.state.FieldRubrics[index] === []){
            let newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[index] = true;
            this.setState({
              FieldRubrics: newFieldRubrics
            });
          }
          else{
            let bool = this.state.FieldRubrics[index] ? false: true;
            let newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[index] = bool;
            this.setState({
              FieldRubrics: newFieldRubrics
            });
          }
        }

    render(){
          let content= null;
          let errorMessage = null;
          let TA_rubric = null;
          let TA_assignmentDescription = null;
          let TA_instructions = null;
          let indexer =  "content";
          let TA_rubricButtonText = this.state.ShowRubric ? "Hide Rubric" : "Show Rubric";
          //if invalid data, shows error message

          if(this.state.Error){
              return(<ErrorComponent />);
          }

          if(this.state.InputError){
            errorMessage = (<Modal title="Submit Error" close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
          }

          if(this.props.Rubric != '' && this.props.Rubric != null){
            if(this.state.ShowRubric){
                TA_rubric = ( <div>
                    <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {TA_rubricButtonText}</button>
                    <ReactCSSTransitionGroup  transitionEnterTimeout={300} transitionLeaveTimeout={300} transitionAppearTimeout={300} transitionName="example" transitionAppear={true}>
                    <div className="regular-text"> {this.props.Rubric}</div>
                    </ReactCSSTransitionGroup>
                    <br />
                  </div>
                );
              }
              else{
                TA_rubric = (<button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {TA_rubricButtonText}</button>
              );
              }
          }

          if(this.props.Instructions != null && this.props.Instructions != '' ){
            TA_instructions = (<div className="regular-text instructions">
                  <b>Insructions</b>: {this.props.Instructions}
                  <br />
            </div>);
          }

          if(this.props.AssignmentDescription != null && this.props.AssignmentDescription != ''){
            TA_assignmentDescription = (<div className="regular-text assignmentDescription">
                  <b>Description</b>: {this.props.AssignmentDescription}
                  <br />
            </div>);
          }



          //creating all input fields here
          let fields = this.state.TaskActivityFields.field_titles.map(function(title, idx){
            let rubricView = null;
            let justification = null;
            let instructions = null;
            let fieldTitleText = '';
            let fieldTitle = null;

            if(!this.state.TaskData[idx]){
              this.setState({Error: true});
              return(<div key={idx}></div>);
            }

            if(this.state.TaskActivityFields[idx].show_title){
              if(this.state.TaskActivityFields[idx].grade_type != null){
                fieldTitleText = title +" Grade";
              }
              else{
                fieldTitleText = title;
              }

              fieldTitle = (<div>
                <br />
                <div key={idx + 600}><b>{fieldTitleText}</b></div>
              </div>);
            }


            if(this.state.TaskActivityFields[idx].rubric != ''){
              let buttonTextHelper = this.state.TaskActivityFields[idx].show_title ? title : '';
              let rubricButtonText = this.state.FieldRubrics[idx] ? ("Hide " + buttonTextHelper + " Rubric") : ("Show " + buttonTextHelper + " Rubric");
              if(this.state.FieldRubrics[idx]){
                rubricView = ( <div>
                    <button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,idx)} > {rubricButtonText}</button>
                    <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={true}>
                    <div className="regular-text"> {this.state.TaskActivityFields[idx].rubric}</div>
                    </ReactCSSTransitionGroup>
                    
                  </div>
                );
              }
              else{
                rubricView =(<button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,idx)} > {rubricButtonText}</button>
                              );
              }

            }

            if(this.state.TaskActivityFields[idx].requires_justification){
              if(this.state.TaskData[idx][1] == ''){
              justification = ( <div>
                                  <div>{this.state.TaskActivityFields[idx].justification_instructions}</div>
                                  <textarea key={idx +100} className="big-text-field" value={this.state.TaskActivityFields[idx].default_content[1]} onChange={this.handleJustificationChange.bind(this, idx)} placeholder="Type your problem here ...">
                                   </textarea>
                              </div>);
                            }
              else {
                justification = ( <div>
                                    <div>{this.state.TaskActivityFields[idx].justification_instructions}</div>
                                    <textarea key={idx +100} className="big-text-field" value={this.state.TaskData[idx][1]} onChange={this.handleJustificationChange.bind(this, idx)} placeholder="Type your problem here ...">
                                     </textarea>
                                </div>);
              }
            }

            if(this.state.TaskActivityFields[idx].instructions != ''){
              instructions = (
                <div>
                  <br />
                  <div className="regular-text"><b>{fieldTitleText} instructions:</b> {this.state.TaskActivityFields[idx].instructions}</div>
                  <br />
                </div>
              );
            }


            if(this.state.TaskActivityFields[idx].input_type == "numeric"){
              if(this.state.TaskActivityFields[idx].grade_type == "grade"){
                let fieldInput = null;
                if(this.state.TaskData[idx][0] == null){
                  fieldInput = (<input type="text"  key={idx}  className="number-input" value={this.state.TaskActivityFields[idx].default_content[0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="...">
                  </input>);
                }
                else{
                  fieldInput = (<input type="text"  key={idx} className="number-input" value={this.state.TaskData[idx][0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="...">
                  </input>);
                }

                return (
                  <div key={idx+200}>
                    {instructions}
                    {rubricView}
                    <br/>
                    <div key={idx + 600}><b>{fieldTitleText}</b> {fieldInput}</div>
                    <br key={idx+500}/>
                    {justification}
                    <br />
                    <br />
                  </div>
                  );
                }
                else if(this.state.TaskActivityFields[idx].grade_type == "rating"){
                  let val = (this.state.TaskData[idx][0] == null || this.state.TaskData[idx][0] == '') ? 0 : this.state.TaskData[idx][0];
                  let nameStr = "rate" + idx;
                  return (
                    <div key={idx+200}>

                      {instructions}

                      {rubricView}
                      <br/>
                      <div key={idx + 600}><b>{fieldTitleText}   </b>
                        <Rater total={this.state.TaskActivityFields[idx].rating_max} rating={val} onRate={this.handleStarChange.bind(this,idx)} /><br />

                      </div>
                      <br key={idx+500}/>
                      {justification}
                      <br />
                      <br />
                    </div>
                    );

                  //add stars logic later
                }

            }
            else if(this.state.TaskActivityFields[idx].input_type == "text"){
              let fieldInput = null;
              if(this.state.TaskData[idx][0] == null){
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskActivityFields[idx].default_content[0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="Type your problem here ...">
                </textarea>)
              }
              else{
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskData[idx][0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="Type your problem here ...">
                </textarea>)
              }

              return (<div key={idx+200}>

                <div key={idx + 600}><b>{fieldTitleText}</b></div>
                {instructions}
                {rubricView}
                <br/>
                {fieldInput}
                <br key={idx+500}/>
                {justification}
                <br />
                <br />
              </div>
              );
            }
          }, this);

          if(this.state.ShowContent){
            content = (<div className="section-content">
              {TA_assignmentDescription}
              {TA_instructions}
              {TA_rubric}
              <br />
                {fields}
              <br />
              <button type="submit" className="divider"><i className="fa fa-check"></i>Submit</button>
              <button type="button" className="divider" onClick={this.saveData.bind(this)}>Save for Later</button>
           </div>);
          }
          else{
            content = (<div></div>)
          }

          return(
            <div className="animate fadeInUp">
              {errorMessage}
              <form  role="form" className="section task-hiding" onSubmit={this.submitData.bind(this)}>
                <div className="placeholder"></div>
                <div onClick={this.toggleContent.bind(this)}>
                  <h2 className="title">{this.props.ComponentTitle} </h2>
                </div>
                {content}
              </form>
            </div>
          );
        }

}

export default SuperComponent;
