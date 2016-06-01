/* This component allows the instructor or another student to edit the original
* problem. It is shown on edit-problem tasks and accepts user input. The component
* makes GET,PUT, and POST requests to load,save, and submit data.
*/
import React from 'react';
import request from 'request';

import ProblemViewComponent  from './problemViewComponent';

class EditProblemComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          AssignmentDescription: '',
          TaskRubric: '',
          TaskInstructions: '',
          EditedProblem: '',
          EditedProblemError: false
      }
  }

  getComponentData() {
      const options = {
          method: 'GET',
          uri: this.props.apiUrl + "/api/taskTemplate/edit/1" + this.props.TaskID,
          json: true
      }

      request(options, (err, res, body) => {
          this.setState({
              AssignmentDescription: body.result.assignmentDescription,
              TaskRubric: body.result.taskRubric,
              TaskInstructions: body.result.taskInstructions,
              EditedProblem: body.result.editedProblemText
          });
      });
  }
  saveData() {
      e.preventDefault();

      const inputError = this.state.EditedProblem.length == 0 ? true : false;

      if (inputError) {
          return this.setState({
              EditedProblemError: inputError
          });
      } else {
          const options = {
              method: 'PUT',
              uri: this.props.apiUrl + '/api/taskTemplate/edit/save',
              body: {
                  taskID: this.props.TaskID,
                  userID: this.props.UserID,
                  editedProblem: this.state.EditedProblem
              },
              json: true
          };

          request(options, (err, res, body) => {
              console.log("Saved" + req.statusCode);
          });
      }
  }
  submitData() {
      e.preventDefault();

      const inputError = this.state.EditedProblem.length == 0 ? true : false;

      if (inputError) {
          return this.setState({
              EditedProblemError: inputError
          });
      } else {
          const options = {
              method: 'POST',
              uri: this.props.apiUrl + '/api/taskTemplate/edit/submit',
              body: {
                  taskID: this.props.TaskID,
                  userID: this.props.UserID,
                  EditedProblem: this.state.UserCreatedProblem
              },
              json: true
          };

          request(options, (err, res, body) => {
              console.log("Submited" + req.statusCode);
          });
      }
  }

  componentWillMount() {
      this.getComponentData();
  }

  handleChange(event) {
      this.setState({
          EditedProblemError: false,
          EditedProblem: event.target.value
      });
  }
  
  render(){
    return(<div>
            <form name="editProblemTask" role="form" className="section" onSubmit={this.submitData.bind(this)}>
            <div name="originalProblemHeader">
              <div className="quoted-section">
                <ProblemViewComponent TaskID = {this.props.TaskID}
                                      apiUrl={this.props.apiUrl}
                                      problemHeader="This is the original problem"/>
              </div>
            </div>
            <div name="editHeader">
              <h2 className="title"> <b>Edit the Problem</b> </h2>
            </div>
            <div className="section-content">
              <textarea className="big-text-field" value={this.state.EditedProblem} onChange={this.handleChange.bind(this)} placeholder="Type your response here ...">
              </textarea>
              <br />
              <button type="submit"><i className="fa fa-check button-group"></i>Submit</button>
              <button type="button" onClick={this.saveData.bind(this)}>Save for Later</button>


           </div>
            </form>
          </div>);
  }

}

export default EditProblemComponent;
