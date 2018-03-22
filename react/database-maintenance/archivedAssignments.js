import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';

class ArchivedAssignments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assignments: []
        };
    }

    render() {
        const {strings} = this.props;

        // React Table
        const columns = [{
            Header: strings.archivedAssignmentsTableCol1,
            accessor: 'assignmentName'
        }, {
            Header: strings.archivedAssignmentsTableCol2,
            accessor: 'courseName'
        }, {
            Header: strings.archivedAssignmentsTableCol3,
            accessor: 'restoreButton'
        }, {
            Header: strings.archivedAssignmentsTableCol4,
            accessor: 'deleteButton'
        }];

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.archivedAssignmentsTableTitle}</h2>
                <div className="section-content">
                    <TableComponent
                        columns={columns}
                        data={this.state.assignments}
                        noDataText="No assignments"
                    />
                </div>
            </div>
        );
    }
}

export default ArchivedAssignments;