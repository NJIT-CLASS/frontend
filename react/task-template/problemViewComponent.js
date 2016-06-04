/* This component will hold the user-made problem. It is shown during all stages after create-problem.
* It only makes one GET request to get the problem stored in the database.
*/
import React from 'react';
import request from 'request';

class ProblemViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      UserProblem: ''
    };
  }

  getComponentData(){
    const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/problemView/' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                UserProblem: body.result.problemText
            });
        });
  }

  componentWillMount(){
    this.getComponentData();
  }

  render(){
      return (
        <div className="section">
          <h2 className="title"> <b>{this.props.problemHeader}: </b> </h2>
          <div className="section-content">
            <div name="problem-text" className="regular-text">{this.state.UserProblem}</div>
            <br />
            <br />
          </div>
        </div>
    );

  }

}
export default ProblemViewComponent;
