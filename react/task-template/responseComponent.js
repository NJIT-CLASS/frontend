/* This component holds the user's response from the Grade solution task. It is a simple
* component and only has a GET call. This is shown during the Grading task and all tasks after.
*/

import React from 'react';
import request from 'request';

class ResponseComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      UserResponse: ''
    };
  }

  getComponentData(){
    const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/responseView/1'+this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                UserResponse: body.result.userResponseText
            });
        });
  }


  componentWillMount(){
    this.getComponentData();
  }

  render(){
    return(<div className="section">
            <h2 className="title"> <b>Response </b> </h2>
            <div className="section-content">
              <div name="response-text" className="regular-text">{this.state.UserResponse}</div>
              <br />

            </div>
          </div>);
  }


}

export default ResponseComponent;
