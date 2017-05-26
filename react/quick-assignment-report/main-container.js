import React, { Component } from 'react';
import request from 'request';
import AssignmentComponent from './assignment-component';

class QuickAssignmentReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentData: {}
        };
    }

    componentWillMount(){
        const url = `http://localhost:3000/api/getAssignmentReport/alternate/${this.props.AssignmentID}`;
        const options = {
            method: 'GET',
            uri: url,
            json: true
        };

        request(options, (err,res, body) => {
            console.log(body);
            this.setState({
                AssignmentData: body.Result
            });
        });
    }

    render(){
        return <div className="quick-assignment-report">
          <AssignmentComponent Assignment={this.state.AssignmentData}/>
        </div>;
    }

}

export default QuickAssignmentReport;
