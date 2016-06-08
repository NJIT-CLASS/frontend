/* This component allows the instructor or another student to edit the original
* problem. It is shown on edit-problem tasks and accepts user input. The component
* makes GET,PUT, and POST requests to load,save, and submit data.
*/
import React from 'react';
import request from 'request';
import Modal from '../shared/modal';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ProblemViewComponent  from './problemViewComponent';

class EditProblemComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          TaskData: {
            field_titles: []
          },
          AssignmentDescription: '',
          Instructions:'',
          Rubric:'',
          ShowRubric: false,
          FieldRubrics: [],
          InputError: false
      }
  }

  getComponentData() {
      const options = {
          method: 'GET',
          uri: this.props.apiUrl + "/api/taskTemplate/edit/" + this.props.TaskID,
          json: true
      }

      request(options, (err, res, body) => {
          this.setState({
              AssignmentDescription: body.assignmentDescription,
              Instructions: body.taskInstructions,
              Rubric: body.taskRubric,
              TaskData: body.taskData
          });
      });
  }

  componentWillMount(){
    this.getComponentData();
  }
  modalToggle(){
    this.setState({InputError:false})
  }

  saveData(e){
    e.preventDefault();
    let validData = true;
    let indexer = this.state.TaskData.users == null ? "content" : this.props.UserID;
    if(this.state.TaskData.users == null){
      this.state.TaskData.field_titles.forEach(function(title){
        if(this.state.TaskData[title].requires_justification){
          if(this.state.TaskData.content[title] == '' || this.state.TaskData.content[title + "_justification"] == ''){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }
        }
        else{
          if(this.state.TaskData.content[title] == ''){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }
        }
      }, this);

    }
    else{
        this.state.TaskData.field_titles.forEach(function(title){
          if(this.state.TaskData[title].requires_justification){
            if(this.state.TaskData[user][title] == '' || this.state.TaskData.content[title + "_justification"] == ''){
              this.setState({
                InputError: true
              });
              validData = false;
              return;
            }
          }
          else {
            if(this.state.TaskData.content[title] == ''){
              this.setState({
                InputError: true
              });
              validData = false;
              return;
            }
          }
        });
    }
    if(validData){
      const options = {
          method: 'PUT',
          uri: this.props.apiUrl + '/api/taskTemplate/edit/save',
          body: {
              taskID: this.props.TaskID,
              userID: this.props.UserID,
              taskData: this.state.TaskData
          },
          json: true
        };

      request(options, (err, res, body) => {
      });
    }
  }

  submitData(e){
    e.preventDefault();
    let validData = true;
    let indexer = this.state.TaskData.users == null ? "content" : this.props.UserID;
    if(this.state.TaskData.users == null){
      this.state.TaskData.field_titles.forEach(function(title){
        if(this.state.TaskData[title].requires_justification){
          if(this.state.TaskData.content[title] == '' || this.state.TaskData.content[title + "_justification"] == ''){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }
        }
        else{
          if(this.state.TaskData.content[title] == ''){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }
        }
      },this);

    }
    else{
        this.state.TaskData.field_titles.forEach(function(title){
          if(this.state.TaskData[title].requires_justification){
            if(this.state.TaskData[indexer][title] == '' || this.state.TaskData.content[title + "_justification"] == ''){
              this.setState({
                InputError: true
              });
              validData = false;
              return;
            }
          }
          else {
            if(this.state.TaskData[indexer][title] == ''){
              this.setState({
                InputError: true
              });
              validData = false;
              return;
            }
          }
        },this);

    }

      if(validData){
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/taskTemplate/edit/submit',
            body: {
                taskID: this.props.TaskID,
                userID: this.props.UserID,
                taskData: this.state.TaskData
            },
            json: true
          };

        request(options, (err, res, body) => {
        });
      }

    }


  handleChange(index,event) {
    let newTaskData = this.state.TaskData;
    if(newTaskData.users == null){
      newTaskData.content[index] = event.target.value;
    }
    else{
        newTaskData[this.props.UserID][index] = event.target.value;
    }

      this.setState({
        TaskData: newTaskData
      });
    }

    toggleRubric(){
      const bool = this.state.ShowRubric ? false : true;

      this.setState({
        ShowRubric: bool
      });
    }

    toggleFieldRubric(title){
        if(this.state.FieldRubrics[title] == null){
          let newFieldRubrics = this.state.FieldRubrics;
          newFieldRubrics[title] = true;
          this.setState({
            FieldRubrics: newFieldRubrics
          });
        }
        else{
          let bool = this.state.FieldRubrics[title] ? false: true;
          let newFieldRubrics = this.state.FieldRubrics;
          newFieldRubrics[title] = bool;
          this.setState({
            FieldRubrics: newFieldRubrics
          });
        }
      }

  render(){
    let errorMessage = null;
    let TA_rubric = null;
    let TA_rubricButtonText = this.state.ShowRubric ? "Hide Rubric" : "Show Rubric";
    let indexer = this.state.TaskData.users == null ? "content" : this.props.UserID;

    //if invalid data, shows error message
    if(this.state.InputError){
      errorMessage = (<Modal title="Submit Error" close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
    }
    if(this.state.Rubric != '' && this.state.Rubric != null){
      if(this.state.ShowRubric){
          TA_rubric = ( <div>
              <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {TA_rubricButtonText}</button>
              <br />
              <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={true}>
              <div className="regular-text"> {this.state.Rubric}</div>
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

    //creating all input fields here
    let fields = this.state.TaskData["field_titles"].map(function(title, idx){
      let rubricView = null;
      let justification = null;
      let fieldTitle = '';
      if(this.state.TaskData[title].show_title){
        if(this.state.TaskData[title].grade_type != null){
          fieldTitle = (<div key={idx + 600}><b>{title} Grade:   </b></div>);
        }
        else{
          fieldTitle = title;
        }
      }
      if(this.state.TaskData[title].rubric != ''){
        let buttonTextHelper = this.state.TaskData[title].show_title ? title : '';
        let rubricButtonText = this.state.FieldRubrics[title] ? ("Hide " + buttonTextHelper + " Rubric") : ("Show " + buttonTextHelper + " Rubric");
        if(this.state.FieldRubrics[title]){
          rubricView = ( <div>
              <button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,title)} > {rubricButtonText}</button>
              <br />
              <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={true}>
              <div className="regular-text"> {this.state.TaskData[title].rubric}</div>
              </ReactCSSTransitionGroup>
            </div>
          );
        }
        else{
          rubricView =(<button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,title)} > {rubricButtonText}</button>
        );
        }

      }
      if(this.state.TaskData[title].requires_justification){
        justification = ( <div>
                            <div>{this.state.TaskData[title].justification_instructions}</div>
                            <textarea key={idx +100} className="big-text-field" value={this.state.TaskData[indexer][title+"_justification"]} onChange={this.handleChange.bind(this, (title+"_justification"))} placeholder="Type your problem here ...">
                             </textarea>
                        </div>);
      }


      if(this.state.TaskData[title].input_type == "numeric"){
        if(this.state.TaskData[title].grade_type == "grade"){
            return (<div key={idx+200}>
              <br />
              <div className="regular-text">{this.state.TaskData[title].instructions}</div>
              <br />
              {rubricView}
              <br/>
              <div>{fieldTitle} </div>
              <input type="text"  key={idx} className="number-input" value={this.state.TaskData[indexer][title]} onChange={this.handleChange.bind(this,title)} placeholder="...">
              </input>
              <br key={idx+500}/>
              {justification}
            </div>
            );
          }
          else if(this.state.TaskData[title].grade_type == "rating"){
            //add stars logic later
          }
      }
      else if(this.state.TaskData[title].input_type == "text"){
        return (<div key={idx+200}>
          <br />
          <div>{fieldTitle} </div>
          <div className="regular-text">{this.state.TaskData[title].instructions}</div>
          <br />
          {rubricView}
          <br/>
          <textarea key={idx} className="big-text-field" value={this.state.TaskData[indexer][title]} onChange={this.handleChange.bind(this,title)} placeholder="Type your problem here ...">
          </textarea>
          <br key={idx+500}/>
          {justification}
        </div>
        );
      }
    }, this);

    return(<div className="animate fadeInDown">
            {errorMessage}
            <form name="editProblemTask" role="form" className="section" onSubmit={this.submitData.bind(this)}>
            <div name="originalProblemHeader">

            </div>
            <div name="editHeader">
              <h2 className="title">Edit the Problem</h2>
            </div>
            <div className="section-content">
              {this.state.Instructions}
              <br />
              {TA_rubric}
              <br />
              {fields}
              <br />
              <button type="submit"><i className="fa fa-check button-group"></i>Submit</button>
              <button type="button" onClick={this.saveData.bind(this)}>Save for Later</button>


           </div>
            </form>
          </div>);
  }

}

export default EditProblemComponent;
