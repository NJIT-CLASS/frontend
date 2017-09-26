import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';

export default class SelectAssignment extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }

    componentWillMount(){
        this.fetch();
    }

    componentWillReceiveProps(props){
        if(this.props.SectionID != props.SectionID){
            this.setState({
                assignmentInstanceID: null
            });
        }
        this.fetch(props);
    }


    fetch(props = null){ //pass in props if there is any
        let assignments = [];

        if(!props){
            props = this.props;
        }

        apiCall.get(`/section/assignments/${props.SectionID}`, (err, res, body) => {
            body.Assignments.map((assignment) => {
                assignments.push({
                    'label': assignment.Assignment.Name,
                    'value': assignment.AssignmentInstanceID
                });
            });

            this.setState({
                assignments: assignments
            });
        });
    }

    changeAssignmentInstanceID(val){
        if(this.state.assignmentInstanceID != val.value){
            this.setState({
                assignmentInstanceID: val.value
            });

            this.props.change(val.value);
        }
    }

    render(){
        return (
            <div className='card'>
                <h2 className='title'>Assignment</h2>
                <br/>
                <Select options={this.state.assignments} value={this.state.assignmentInstanceID} onChange={this.changeAssignmentInstanceID.bind(this)} placeholder="Selected" resetValue={''} clearable={true} searchable={true}/>
            </div>
        );
    }
};