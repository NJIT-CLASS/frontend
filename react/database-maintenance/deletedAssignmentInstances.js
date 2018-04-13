import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';
import apiCall from '../shared/apiCall';

class DeletedAssignments extends Component {

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
                restoreButton: <button type="button" onClick={this.selectAssignment.bind(this, assignment, 'restore')}>Restore</button>
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

    restoreAssignment() {
        console.log('Restore assignment');
        console.log(this.state.selectedAssignment);
    }

    render() {
        const {strings} = this.props;
        const columnNames = strings.assignmentInstanceDeletedColumns;

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
        const data = this.bindButtons(this.props.assignments);

        let content;
        if (this.state.selectedAssignment == null) {
            content = <TableComponent
                columns={columns}
                data={data}
                noDataText="No assignments"
            />;
        } else {
            const selectedAssignment = this.state.selectedAssignment;
            const type = this.state.type;
            content = <form onSubmit={this.restoreAssignment.bind(this)}>
                <p style={{fontWeight: 'bold'}}>Are you sure you want to restore?</p>
                <br />
                <p><span style={{fontWeight: 'bold'}}>Assignment:</span> {selectedAssignment.assignmentName}</p>
                <p><span style={{fontWeight: 'bold'}}>Course:</span> {selectedAssignment.courseNumber}</p>
                <br />
                <button type="submit">Restore</button>
                <button type="button" onClick={this.unselectAssignment.bind(this)}>Cancel</button>
            </form>;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.deletedTableTitle}</h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default DeletedAssignments;