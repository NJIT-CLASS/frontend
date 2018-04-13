import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';
import apiCall from '../shared/apiCall';

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
        this.loadAssignments();
    }

    loadAssignments() {
        apiCall.get('/displayarchivedinstance', (err, res, body) => {
            if (res.statusCode == 200) {
                console.log(body);
                let assignments = body.ArchivedAssignmentInstance.map(instance => {
                    return {
                        assignmentId: instance.AssignmentInstanceID,
                        assignmentName: 'AssignmentInstanceID' + instance.AssignmentInstanceID,
                        courseNumber: instance.Section.Course.Number,
                        sectionName: instance.Section.Name,
                        semesterName: instance.Section.Semester.Name
                    };
                });
                this.setState({ assignments });
            }
        });
    }

    bindButtons(assignments) {
        return assignments.map(assignment => {
            return {
                assignmentId: assignment.assignmentId,
                assignmentName: assignment.assignmentName,
                courseNumber: assignment.courseNumber,
                sectionName: assignment.sectionName,
                semesterName: assignment.semesterName,
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

    render() {
        const {strings} = this.props;
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
                <p style={{fontWeight: 'bold'}}>Are you sure you want to {type}?</p>
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
                <h2 className="title">{strings.archivedTableTitle}</h2>
                <div className="section-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default ArchivedAssignments;