import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';

class Assignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: []
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
                archiveButton: <a href="/archive"><button type="button">Archive</button></a>,
                deleteButton: <a href="/delete"><button type="button">Delete</button></a>
            };
        });
    }

    render() {
        const {strings} = this.props;

        // React Table
        const columns = [{
            Header: strings.assignmentsTableCol1,
            accessor: 'assignmentName'
        }, {
            Header: strings.assignmentsTableCol2,
            accessor: 'courseName'
        }, {
            Header: strings.assignmentsTableCol3,
            accessor: 'archiveButton'
        }, {
            Header: strings.assignmentsTableCol4,
            accessor: 'deleteButton'
        }];

        const data = this.bindButtons(this.state.assignments);

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.assignmentsTableTitle}</h2>
                <div className="section-content">
                    <TableComponent
                        columns={columns}
                        data={data}
                        noDataText="No assignments"
                    />
                </div>
            </div>
        );
    }
}

export default Assignments;