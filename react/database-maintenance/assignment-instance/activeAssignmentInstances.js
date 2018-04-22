import React, { Component } from 'react';

import TableComponent from '../../shared/tableComponent';
import apiCall from '../../shared/apiCall';
import Tooltip from '../../shared/tooltip';

class Assignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAssignment: null,
            type: null
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
                archiveButton: <button type="button" onClick={this.selectAssignment.bind(this, assignment, 'archive')}>Archive</button>,
                deleteButton: <button type="button" onClick={this.selectAssignment.bind(this, assignment, 'delete')}>Delete</button>
            };
        });
    }

    selectAssignment(assignment, type) {
        this.setState({
            selectedAssignment: assignment,
            type: type
        });
    }

    unselectAssignment() {
        this.setState({
            selectedAssignment: null,
            type: null
        });
    }

    archiveAssignment(event) {
        event.preventDefault();
        const selectedAssignment = this.state.selectedAssignment;
        apiCall.get(`/archiveinstance/${selectedAssignment.assignmentId}`, (err, res, body) => {
            if (res.statusCode == 201) {
                this.unselectAssignment();
                this.props.loadData();
            }
        });
    }

    deleteAssignment(event) {
        event.preventDefault();
        const selectedAssignment = this.state.selectedAssignment;
        apiCall.get(`/removeinstance/${selectedAssignment.assignmentId}`, (err, res, body) => {
            if (res.statusCode == 201) {
                this.unselectAssignment();
                this.props.loadData();
            }
        });
    }

    render() {
        const { strings, assignments } = this.props;
        const columnNames = strings.assignmentInstanceCurrentColumns;

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
            accessor: 'archiveButton'
        }, {
            Header: columnNames[5],
            accessor: 'deleteButton'
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
            const type = this.state.type;
            content = <form onSubmit={type == 'archive' ? this.archiveAssignment.bind(this) : this.deleteAssignment.bind(this)}>
                <p style={{fontWeight: 'bold'}}>{type == 'archive' ? strings.archiveConfirmation : strings.deleteConfirmation}</p>
                <br />
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[0]}:</span> {selectedAssignment.assignmentName}</p>
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[1]}:</span> {selectedAssignment.courseNumber}</p>
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[2]}:</span> {selectedAssignment.sectionName}</p>
                <p><span style={{fontWeight: 'bold'}}>{strings.assignmentInstanceConfirmationScreen[3]}:</span> {selectedAssignment.semesterName}</p>
                <br />
                <button type="submit">{type == 'archive' ? strings.archiveButton : strings.deleteButton}</button>
                <button type="button" onClick={this.unselectAssignment.bind(this)}>{strings.cancelButton}</button>
            </form>;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">
                    {strings.currentTableTitle}
                    <Tooltip Text={strings.currentTableTooltip} />
                </h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default Assignments;