/* This component is show when the tasks is to create the problem. It will show
* the assignment description, the rubric, the instructions, and a text area. The
* component will be able to make a PUT request to save the data for later, a GET
* request to get the initial data, and a POST request for final submission.
*/
import React from 'react';
import request from 'request';
import Modal from '../shared/modal'

class CreateProblemComponent extends React.Component {
  constructor (props){
    super(props);

    this.state = {
      AssignmentDescription: '',
      Guidelines:'',
      UserCreatedProblem: '',
      UserCreatedProblemError: false
    };
  }

  getComponentData () {
    const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/create/' + this.props.TaskID,
            json: true
        };

    request(options, (err, res, body) => {
        this.setState({
            AssignmentDescription: body.result.assignmentDescription,
            Guidelines: body.result.guidelines,
            UserCreatedProblem: body.result.UserCreatedProblem
        });
    });
  }

  saveData(e){
    e.preventDefault();

    if(this.state.UserCreatedProblem == null){
      this.setState({
        UserCreatedProblemError: true
      });
      return;
    }

    const options = {
        method: 'PUT',
        uri: this.props.apiUrl + '/api/taskTemplate/create/save',
        body: {
            taskID: this.props.TaskID,
            userID: this.props.UserID,
            userCreatedProblem: this.state.UserCreatedProblem
        },
        json: true
      };

    request(options, (err, res, body) => {
    });

  }

  submitData(e){
    e.preventDefault();

    if(this.state.UserCreatedProblem == null){
      this.setState({
        UserCreatedProblemError: true
      });
      return;
    }

    const inputError = this.state.UserCreatedProblem.length == 0 ? true : false;

    if(inputError){
      this.setState({
        UserCreatedProblemError: inputError
      });
      return;
    }
    else{
      const options = {
          method: 'POST',
          uri: this.props.apiUrl + '/api/taskTemplate/create/submit',
          body: {
              taskID: this.props.TaskID,
              userID: this.props.UserID,
              userCreatedProblem: this.state.UserCreatedProblem
          },
          json: true
        };

      request(options, (err, res, body) => {
      });
    }
  }

  modalToggle(){
    this.setState({UserCreatedProblemError:false})
  }
  componentWillMount(){
    this.getComponentData();
  }

  handleChange(event) {
      this.setState({UserCreatedProblem: event.target.value});
    }

  render(){
    let errorMessage = null;
    if(this.state.UserCreatedProblemError){
      errorMessage = (<Modal title="Submit Error" close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
    }
    return(
      <div>
        {errorMessage}
        <form name="createProblemTask" role="form" className="section" onSubmit={this.submitData.bind(this)}>
          <div name="assignmentDescriptionHeader">
            <h2 className="title">Create a Problem </h2>
          </div>
          <div className="section-content">
          	<div name="assignmentDescription" className="regular-text">
              {this.state.AssignmentDescription}
      		  </div>
            <br />
            <textarea className="big-text-field" value={this.state.UserCreatedProblem} onChange={this.handleChange.bind(this)} placeholder="Type your problem here ...">
            </textarea>
            <br />
            <button type="submit" className="divider"><i className="fa fa-check"></i>Submit</button>
            <button type="button" className="divider" onClick={this.saveData.bind(this)}>Save for Later</button>
         </div>
        </form>
      </div>
    );
  }


}

export default CreateProblemComponent;
