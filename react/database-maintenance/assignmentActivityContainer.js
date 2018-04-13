import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';

import ActiveAssignmentActivities from './activeAssignmentActivities';
import ArchivedAssignmentActivities from './archivedAssignmentActivities';
import DeletedAssignmentActivities from './deletedAssignmentActivities';
import strings from './strings';
    
class AssignmentActivityContainer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            activeAssignmentActivities: [],
            archivedAssignmentActivities: [],
            deletedAssignmentActivities: []
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.loadActiveAssignmentActivities();
        this.loadArchivedAssignmentActivities();
        this.loadDeletedAssignmentActivities();
    }

    loadActiveAssignmentActivities() {
        apiCall.get('/displayactiveactivity', (err, res, body) => {
            if (res.statusCode == 200) {
                let activeAssignmentActivities = body.ActiveAssignment.map(instance => {
                    return {
                        assignmentId: instance.AssignmentID,
                        assignmentName: instance.DisplayName,
                        courseNumber: instance.Course.Number
                    };
                });
                this.setState({ activeAssignmentActivities });
            }
        });
    }

    loadArchivedAssignmentActivities() {
        apiCall.get('/displayarchivedactivity', (err, res, body) => {
            if (res.statusCode == 200) {
                let archivedAssignmentActivities = body.ArchivedAssignment.map(instance => {
                    return {
                        assignmentId: instance.AssignmentID,
                        assignmentName: instance.DisplayName,
                        courseNumber: instance.Course.Number
                    };
                });
                this.setState({ archivedAssignmentActivities });
            }
        });
    }

    loadDeletedAssignmentActivities() {
        apiCall.get('/displayremovedactivity', (err, res, body) => {
            if (res.statusCode == 200) {
                let deletedAssignmentActivities = body.RemovedAssignment.map(instance => {
                    return {
                        assignmentId: instance.AssignmentID,
                        assignmentName: instance.DisplayName,
                        courseNumber: instance.Course.Number
                    };
                });
                this.setState({ deletedAssignmentActivities });
            }
        });
    }

    render() {
        return <div>
            <ActiveAssignmentActivities strings={this.props.strings} assignments={this.state.activeAssignmentActivities} loadData={this.loadData.bind(this)} />
            <ArchivedAssignmentActivities strings={this.props.strings} assignments={this.state.archivedAssignmentActivities} loadData={this.loadData.bind(this)} />
            <DeletedAssignmentActivities strings={this.props.strings} assignments={this.state.deletedAssignmentActivities} loadData={this.loadData.bind(this)} />
        </div>;
    }
}
         
export default AssignmentActivityContainer;