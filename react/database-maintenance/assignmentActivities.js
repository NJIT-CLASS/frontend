import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';

class Assignments extends Component {

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
            assignmentName: 'Assignment-1',
            courseName: 'CS 602'
        }, {
            assignmentId: 7,
            assignmentName: 'Assignment-4',
            courseName: 'CS 610'
        }, {
            assignmentId: 8,
            assignmentName: 'Assignment-5',
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

    archiveAssignment() {
        console.log('Archive assignment');
        console.log(this.state.selectedAssignment);
    }

    deleteAssignment() {
        console.log('Delete assignment');
        console.log(this.state.selectedAssignment);
    }

    render() {
        const {strings} = this.props;
        const columnNames = strings.assignmentActivityCurrentColumns;

        // React Table
        const columns = [{
            Header: columnNames[0],
            accessor: 'assignmentName'
        }, {
            Header: columnNames[1],
            accessor: 'courseName'
        }, {
            Header: columnNames[2],
            accessor: 'archiveButton'
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
            content = <form onSubmit={type == 'archive' ? this.archiveAssignment.bind(this) : this.deleteAssignment.bind(this)}>
                <p style={{fontWeight: 'bold'}}>Are you sure you want to {type}?</p>
                <br />
                <p><span style={{fontWeight: 'bold'}}>Assignment:</span> {selectedAssignment.assignmentName}</p>
                <p><span style={{fontWeight: 'bold'}}>Course:</span> {selectedAssignment.courseName}</p>
                <br />
                <button type="submit">{type == 'archive' ? 'Archive' : 'Delete'}</button>
                <button type="button" onClick={this.unselectAssignment.bind(this)}>Cancel</button>
            </form>;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.currentTableTitle}</h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default Assignments;