import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';

class ArchivedAssignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            selectedAssignment: null,
            type: null
        };
    }

    componentDidMount() {
        this.loadTestData();
    }

    loadTestData() {
        const assignments = [{
            assignmentId: 5,
            assignmentName: 'Assignment-2',
            courseName: 'CS 602'
        }, {
            assignmentId: 7,
            assignmentName: 'Assignment-3',
            courseName: 'CS 610'
        }, {
            assignmentId: 8,
            assignmentName: 'Assignment-6',
            courseName: 'CS 631'
        }];
        this.setState({ assignments });
    }

    bindButtons(assignments) {
        return assignments.map(assignment => {
            return {
                assignmentId: assignment.assignmentId,
                assignmentName: assignment.assignmentName,
                courseName: assignment.courseName,
                restoreButton: <button type="button" onClick={this.selectAssignment.bind(this, assignment, 'restore')}>Restore</button>,
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

    restoreAssignment() {
        console.log('Restore assignment');
        console.log(this.state.selectedAssignment);
    }

    deleteAssignment() {
        console.log('Delete assignment');
        console.log(this.state.selectedAssignment);
    }

    render() {
        const {strings} = this.props;
        const columnNames = strings.assignmentActivityArchivedColumns;

        // React Table
        const columns = [{
            Header: columnNames[0],
            accessor: 'assignmentName'
        }, {
            Header: columnNames[1],
            accessor: 'courseName'
        }, {
            Header: columnNames[2],
            accessor: 'restoreButton'
        }, {
            Header: columnNames[3],
            accessor: 'deleteButton'
        }];
        const data = this.bindButtons(this.state.assignments);

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
            content = <form onSubmit={type == 'restore' ? this.restoreAssignment.bind(this) : this.deleteAssignment.bind(this)}>
                <p style={{fontWeight: 'bold'}}>Are you sure you want to {type}?</p>
                <br />
                <p><span style={{fontWeight: 'bold'}}>Assignment:</span> {selectedAssignment.assignmentName}</p>
                <p><span style={{fontWeight: 'bold'}}>Course:</span> {selectedAssignment.courseName}</p>
                <br />
                <button type="submit">{type == 'restore' ? 'Restore' : 'Delete'}</button>
                <button type="button" onClick={this.unselectAssignment.bind(this)}>Cancel</button>
            </form>;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.archivedTableTitle}</h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default ArchivedAssignments;