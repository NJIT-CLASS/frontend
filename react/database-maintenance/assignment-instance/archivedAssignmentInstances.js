import React, { Component } from 'react';

import TableComponent from '../../shared/tableComponent';
import apiCall from '../../shared/apiCall';
import Tooltip from '../../shared/tooltip';

class ArchivedAssignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAssignment: null
        };
    }

    bindButtons(assignments) {
        return assignments.map(assignment => {
            return {
                assignmentId: assignment.assignmentId,
                assignmentName: assignment.assignmentName,
                courseNumber: assignment.courseNumber,
                sectionName: assignment.sectionName,
                semesterName: assignment.semesterName,
                restoreButton: assignment.ArchivedAssignment != null || assignment.Assignment == null ?
                    <Tooltip Text={this.props.strings.restoreInstanceDisabledTootlip} /> :
                    <button type="button" onClick={this.selectAssignment.bind(this, assignment)}>Restore</button>
            };
        });
    }

    selectAssignment(assignment) {
        this.setState({
            selectedAssignment: assignment
        });
    }

    unselectAssignment() {
        this.setState({
            selectedAssignment: null
        });
    }

    restoreAssignment(event) {
        event.preventDefault();
        const selectedAssignment = this.state.selectedAssignment;
        apiCall.get(`/restorearchivedinstance/${selectedAssignment.assignmentId}`, (err, res, body) => {
            if (res.statusCode == 201) {
                this.unselectAssignment();
                this.props.loadData();
            }
        });
    }

    render() {
        const { strings, assignments } = this.props;
        const columnNames = strings.assignmentInstanceArchivedColumns;

        // React Table
        const columns = [{
            Header: columnNames[0],
            accessor: 'assignmentName'
        }, {
            Header: columnNames[1],
            accessor: 'courseNumber'
        }, {
            Header: columnNames[2],
            accessor: 'sectionName'
        }, {
            Header: columnNames[3],
            accessor: 'semesterName'
        }, {
            Header: columnNames[4],
            accessor: 'restoreButton'
        }];
        const data = this.bindButtons(assignments);

        let content;
        if (this.state.selectedAssignment == null) {
            content = <TableComponent
                columns={columns}
                data={data}
                noDataText={strings.emptyTable}
            />;
        } else {
            const selectedAssignment = this.state.selectedAssignment;
            content = <form onSubmit={this.restoreAssignment.bind(this)}>
                <p style={{fontWeight: 'bold'}}>{strings.restoreConfirmation}</p>
                <br />
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[0]}:</span> {selectedAssignment.assignmentName}</p>
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[1]}:</span> {selectedAssignment.courseNumber}</p>
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[2]}:</span> {selectedAssignment.sectionName}</p>
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[3]}:</span> {selectedAssignment.semesterName}</p>
                <br />
                <button type="submit">{strings.restoreButton}</button>
                <button type="button" onClick={this.unselectAssignment.bind(this)}>{strings.cancelButton}</button>
            </form>;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">
                    {strings.archivedTableTitle}
                    <Tooltip Text={strings.archivedTableTooltip} />
                </h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default ArchivedAssignments;