/* This component will get the user's response to the problem. It is shown only
* on a solve-problem task. It makes a GET request to get the stored data, a PUT
* request to save data for later, and a POST request to submit data.
*/

import React from 'react';
import request from 'request';

class SolveProblemComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        UserSolution: '',
        UserSolutionError: false
    };
  }
  getComponentData() {
    const options = {
        method: 'GET',
        uri: this.props.apiUrl + '/api/taskTemplate/solve/' + this.props.TaskID,
        json: true
    };

    request(options, (err, res, body) => {
        this.setState({
            UserSolution: body.result.userSolution
        });
    });
}

  handleChange(event) {
      this.setState({
          UserSolutionError: false,
          UserSolution: event.target.value
      });
  }

  saveData(e) {
      e.preventDefault();

      const inputError = this.state.UserSolution.length == 0 ? true : false;

      if (inputError) {
          return this.setState({
              UserSolutionError: inputError
          });
      } else {
          const options = {
              method: 'PUT',
              uri: this.props.apiUrl + '/api/taskTemplate/solve/save',
              body: {
                  taskID: this.props.TaskID,
                  userID: this.props.UserID,
                  userCreatedProblem: this.state.UserCreatedProblem
              },
              json: true
          };

          request(options, (err, res, body) => {
              console.log(req.statusCode);
          });
      }
  }

  submitData(e) {
    e.preventDefault();

    const inputError = this.state.UserSolution.length === 0 ? true : false;

    if (inputError) {
        return this.setState({
            UserSolutionError: inputError
        });
    } else {
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/taskTemplate/solve/submit',
            body: {
                taskID: this.props.TaskID,
                userID: this.props.UserID,
                userSolution: this.state.UserSolution
            },
            json: true
        };

        request(options, (err, res, body) => { //junk code
            
        });
    }
}

componentWillMount() {
    this.getComponentData();
}

  render(){
    return(
      <div>
        <form name="solveProblemTask" role="form" className="section" onSubmit={this.submitData.bind(this)}>
          <div name="solveHeader">
            <h2 className="title"> <b>Solve the Problem</b> </h2>
          </div>
          <div className="section-content">
            <textarea className="big-text-field" value={this.state.UserSolution} onChange={this.handleChange.bind(this)} placeholder="Type your response here ...">
            </textarea>
            <br />
            <button type="submit"><i className="fa fa-check"></i>Submit</button>
            <button type="button" onClick={this.saveData.bind(this)}>Save for Later</button>


         </div>
        </form>
      </div>
    );
  }

}

export default SolveProblemComponent;
