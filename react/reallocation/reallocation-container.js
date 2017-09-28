import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import SelectSection from './select-section';
import SelectAssignment from './select-assignment';
import AssignmentTable from './assignment-table';

export default class Reallocation extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    changeSectionID(sectionID){
        this.setState({
            sectionID: sectionID,
            assignmentInstanceID: null
        });
    }

    changeAssignmentInstanceID(assignmentInstanceID){
        this.setState({
            assignmentInstanceID: assignmentInstanceID
        });
    }

    render(){
        let output = [];
        output.push(<SelectSection key={1} UserID={this.props.UserID} change={this.changeSectionID.bind(this)}/> );
        
        if(this.state.sectionID){
            output.push(<SelectAssignment key={2} SectionID={this.state.sectionID} change={this.changeAssignmentInstanceID.bind(this)}/>);
        }
        if(this.state.assignmentInstanceID){
            output.push(<AssignmentTable key={3} AssignmentInstanceID={this.state.assignmentInstanceID} SectionID={this.state.sectionID}/>);
        }

        return (
            <div>
                {output}
            </div>
        );
    }
}