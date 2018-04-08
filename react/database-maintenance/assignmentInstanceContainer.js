import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';

import AssignmentInstances from './assignmentInstances';
import ArchivedAssignmentInstances from './archivedAssignmentInstances';
import DeletedAssignmentInstances from './deletedAssignmentInstances';
import strings from './strings';
    
class AssignmentActivityContainer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        return <div>
            <AssignmentInstances strings={this.props.strings} />
            <ArchivedAssignmentInstances strings={this.props.strings} />
            <DeletedAssignmentInstances strings={this.props.strings} />
        </div>;
    }
}
         
export default AssignmentActivityContainer;