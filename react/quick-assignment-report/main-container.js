import React, { Component } from 'react';
import request from 'request';
import AssignmentComponent from './assignment-component';
import FilterSection from './filtersSection';

class QuickAssignmentReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentData: {},
            Filters: {
                Type: '',
                Status: [''],
                WorkflowID: ''
            }
        };

        this.changeFilterType = this.changeFilterType.bind(this);
        this.changeFilterWorkflowID = this.changeFilterWorkflowID.bind(this);
        this.changeFilterStatus = this.changeFilterStatus.bind(this);
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

    changeFilterType(val){
        let newFilters = this.state.Filters;
        newFilters.Type = val.value;
        this.setState({
            Filters: newFilters
        });
    }

    changeFilterWorkflowID(val){
        let newFilters = this.state.Filters;
        newFilters.WorkflowID = val.value;
        this.setState({
            Filters: newFilters
        });
    }

    changeFilterStatus(statusArray){
        let newFilters = this.state.Filters;
        newFilters.Status = statusArray.map(t => t.value);
        this.setState({
            Filters: newFilters
        });
    }

    render(){
        return <div className="quick-assignment-report" >
          <FilterSection Filters={this.state.Filters} changeFilterStatus={this.changeFilterStatus}
             changeFilterWorkflowID={this.changeFilterWorkflowID} changeFilterType={this.changeFilterType} />
          <AssignmentComponent Assignment={this.state.AssignmentData} Filters={this.state.Filters}/>
        </div>;
    }

}

export default QuickAssignmentReport;
