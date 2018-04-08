import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';

import AssignmentActivities from './assignmentActivities';
import ArchivedAssignmentActivities from './archivedAssignmentActivities';
import DeletedAssignmentActivities from './deletedAssignmentActivities';
import strings from './strings';
    
class AssignmentActivityContainer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div>
            <AssignmentActivities strings={this.props.strings} />
            <ArchivedAssignmentActivities strings={this.props.strings} />
            <DeletedAssignmentActivities strings={this.props.strings} />
        </div>;
    }
}
         
export default AssignmentActivityContainer;