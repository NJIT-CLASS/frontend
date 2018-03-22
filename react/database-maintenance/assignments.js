import React, { Component } from 'react';
import TableComponent from '../shared/tableComponent';

class Assignments extends Component {

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

        return (
            <div className="section card-2 sectionTable">
                <h2 className="title">{strings.assignmentsTableTitle}</h2>
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

export default Assignments;