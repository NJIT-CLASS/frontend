import React, { Component } from 'react';
import AssignmentComponent from './assignment-component';
import FilterSection from './filtersSection';
import LegendSection from './legendSection';
import strings from './strings';
import apiCall from '../shared/apiCall';
import ReallocationModal from './reallocation-modal';
class QuickAssignmentReport extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            AssignmentData: {},
            Filters: {
                Type: '',
                Status: [''],
                WorkflowID: ''
            },
            Strings: strings,
            Modal:null,
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

    closeModal(){
        this.setState({Modal:null});
    }

    displayReallocateModal(userID, taskInstanceID){
        console.log(this.props.AssignmentID);
        var title = "Reallocate task ID: "+taskInstanceID;
        this.setState({Modal:(<ReallocationModal taskInstanceID={taskInstanceID} AssignmentID={this.props.AssignmentID} title={title} close={this.closeModal.bind(this)}></ReallocationModal>)});
    }

    render(){
        if(!this.state.Loaded){
            return <div></div>;
        }

        return <div className="quick-assignment-report" >
            {this.state.Modal}
          <FilterSection Filters={this.state.Filters} changeFilterStatus={this.changeFilterStatus}
             changeFilterWorkflowID={this.changeFilterWorkflowID} changeFilterType={this.changeFilterType}
             Strings={this.state.Strings}
           />
           <LegendSection Strings={this.state.Strings} />
          <AssignmentComponent onReallocate={this.displayReallocateModal.bind(this)}
                               Assignment={this.state.AssignmentData}
                               Filters={this.state.Filters}
                               Strings={this.state.Strings}/>
        </div>;
    }

}

export default QuickAssignmentReport;
