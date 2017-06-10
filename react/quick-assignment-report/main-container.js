import React, { Component } from 'react';
import AssignmentComponent from './assignment-component';
import FilterSection from './filtersSection';
import LegendSection from './legendSection';
import strings from './strings';
import apiCall from '../shared/apiCall';


class QuickAssignmentReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentData: {},
            Filters: {
                Type: '',
                Status: [''],
                WorkflowID: ''
            },
            Strings: strings,
            Loaded: false
        };

        this.changeFilterType = this.changeFilterType.bind(this);
        this.changeFilterWorkflowID = this.changeFilterWorkflowID.bind(this);
        this.changeFilterStatus = this.changeFilterStatus.bind(this);
    }

    componentWillMount(){
        const url = `/getAssignmentReport/alternate/${this.props.AssignmentID}`;

        this.props.__(strings, (newStrings) => {
            apiCall.get(url, (err,res, body) => {
                console.log(body);
                this.setState({
                    AssignmentData: body.Result,
                    Strings: newStrings,
                    Loaded: true
                });
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
        if(!this.state.Loaded){
            return <div></div>;
        }

        return <div className="quick-assignment-report" >
          <FilterSection Filters={this.state.Filters} changeFilterStatus={this.changeFilterStatus}
             changeFilterWorkflowID={this.changeFilterWorkflowID} changeFilterType={this.changeFilterType}
             Strings={this.state.Strings}
           />
           <LegendSection Strings={this.state.Strings} />
          <AssignmentComponent Assignment={this.state.AssignmentData}
                               Filters={this.state.Filters}
                               Strings={this.state.Strings}/>
        </div>;
    }

}

export default QuickAssignmentReport;
