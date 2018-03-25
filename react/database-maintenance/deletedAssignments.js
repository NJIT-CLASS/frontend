import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';

class DeletedAssignments extends Component {

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
            assignmentId: 7,
            assignmentName: 'Assignment-7',
            courseName: 'CS 602'
        }, {
            assignmentId: 8,
            assignmentName: 'Assignment-8',
            courseName: 'CS 610'
        }, {
            assignmentId: 9,
            assignmentName: 'Assignment-9',
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

        // React Table
        const columns = [{
            Header: strings.deletedAssignmentsTableCol1,
            accessor: 'assignmentName'
        }, {
            Header: strings.deletedAssignmentsTableCol2,
            accessor: 'courseName'
        }, {
            Header: strings.deletedAssignmentsTableCol3,
            accessor: 'restoreButton'
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
            content = <form onSubmit={this.restoreAssignment.bind(this)}>
                <p style={{fontWeight: 'bold'}}>Are you sure you want to restore?</p>
                <br />
                <p><span style={{fontWeight: 'bold'}}>Assignment:</span> {selectedAssignment.assignmentName}</p>
                <p><span style={{fontWeight: 'bold'}}>Course:</span> {selectedAssignment.courseName}</p>
                <br />
                <button type="submit">Restore</button>
                <button type="button" onClick={this.unselectAssignment.bind(this)}>Cancel</button>
            </form>;
        }

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.deletedAssignmentsTableTitle}</h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default DeletedAssignments;