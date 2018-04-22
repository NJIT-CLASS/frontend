import React, { Component } from 'react';

import TableComponent from '../../shared/tableComponent';
import apiCall from '../../shared/apiCall';
import Tooltip from '../../shared/tooltip';

class DeletedAssignments extends Component {

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
                restoreButton: <button type="button" onClick={this.selectAssignment.bind(this, assignment)}>Restore</button>
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
        apiCall.get(`/restoreremovedactivity/${selectedAssignment.assignmentId}`, (err, res, body) => {
            if (res.statusCode == 201) {
                this.unselectAssignment();
                this.props.loadData();
            }
        });
    }

    render() {
        const { strings, assignments } = this.props;
        const columnNames = strings.assignmentActivityDeletedColumns;

        // React Table
        const columns = [{
            Header: columnNames[0],
            accessor: 'assignmentName'
        }, {
            Header: columnNames[1],
            accessor: 'courseNumber'
        }, {
            Header: columnNames[2],
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
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentActivityConfirmationScreen[0]}:</span> {selectedAssignment.assignmentName}</p>
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentActivityConfirmationScreen[1]}:</span> {selectedAssignment.courseNumber}</p>
                <br />
                <button type="submit">{strings.restoreButton}</button>
                <button type="button" onClick={this.unselectAssignment.bind(this)}>{strings.cancelButton}</button>
            </form>;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">
                    {strings.deletedTableTitle}
                    <Tooltip Text={strings.deletedTableTooltip} />
                </h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default DeletedAssignments;