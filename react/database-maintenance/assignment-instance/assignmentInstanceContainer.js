import React, { Component } from 'react';
import PropTypes from 'prop-types';

import apiCall from '../../shared/apiCall';

import ActiveAssignmentInstances from './activeAssignmentInstances';
import ArchivedAssignmentInstances from './archivedAssignmentInstances';
import DeletedAssignmentInstances from './deletedAssignmentInstances';
import strings from '../strings';
    
class AssignmentInstanceContainer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            activeAssignmentInstances: [],
            archivedAssignmentInstances: [],
            deletedAssignmentInstances: []
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.loadActiveAssignmentInstances();
        this.loadArchivedAssignmentInstances();
        this.loadDeletedAssignmentInstances();
    }

    loadActiveAssignmentInstances() {
        apiCall.get('/displayactiveinstance', (err, res, body) => {
            if (res.statusCode == 200) {
                let activeAssignmentInstances = body.ActiveAssignmentInstance.map(instance => {
                    return {
                        assignmentId: instance.AssignmentInstanceID,
                        assignmentName: instance.DisplayName,
                        courseNumber: instance.Section.Course.Number,
                        sectionName: instance.Section.Name,
                        semesterName: instance.Section.Semester.Name
                    };
                });
                this.setState({ activeAssignmentInstances });
            }
        });
    }

    loadArchivedAssignmentInstances() {
        apiCall.get('/displayarchivedinstance', (err, res, body) => {
            if (res.statusCode == 200) {
                let archivedAssignmentInstances = body.ArchivedAssignmentInstance.map(instance => {
                    return {
                        assignmentId: instance.AssignmentInstanceID,
                        assignmentName: instance.DisplayName,
                        courseNumber: instance.Section.Course.Number,
                        sectionName: instance.Section.Name,
                        semesterName: instance.Section.Semester.Name,
                        ArchivedAssignment: instance.ArchivedAssignment,
                        Assignment: instance.Assignment
                    };
                });
                this.setState({ archivedAssignmentInstances });
            }
        });
    }

    loadDeletedAssignmentInstances() {
        apiCall.get('/displayremovedinstance', (err, res, body) => {
            if (res.statusCode == 200) {
                let deletedAssignmentInstances = body.RemovedAssignmentInstance.map(instance => {
                    return {
                        assignmentId: instance.AssignmentInstanceID,
                        assignmentName: instance.DisplayName,
                        courseNumber: instance.Section.Course.Number,
                        sectionName: instance.Section.Name,
                        semesterName: instance.Section.Semester.Name,
                        ArchivedAssignment: instance.ArchivedAssignment,
                        Assignment: instance.Assignment
                    };
                });
                this.setState({ deletedAssignmentInstances });
            }
        });
    }

    render() { 
        return <div>
            <ActiveAssignmentInstances strings={this.props.strings} assignments={this.state.activeAssignmentInstances} loadData={this.loadData.bind(this)} />
            <ArchivedAssignmentInstances strings={this.props.strings} assignments={this.state.archivedAssignmentInstances} loadData={this.loadData.bind(this)} />
            <DeletedAssignmentInstances strings={this.props.strings} assignments={this.state.deletedAssignmentInstances} loadData={this.loadData.bind(this)} />
        </div>;
    }
}
         
export default AssignmentInstanceContainer;