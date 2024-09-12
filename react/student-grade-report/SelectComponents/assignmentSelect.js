import React, { Component } from 'react';
import apiCall from '../../shared/apiCall';
import Select from 'react-select';

class AssignmentInstanceSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            AssignmentList: []
        };

        this.selectAssignment = this.props.selectAssignment.bind(this);
    }

    componentWillMount() {
        this.getAssignmentList(this.props);

    }
    componentWillReceiveProps(nextProps) {
        this.getAssignmentList(nextProps);
    }

    getAssignmentList(props) {
        apiCall.get(`/getActiveAssignmentsForSection/${props.SectionID}`, (err, res, body) => {
            // console.log(res.statusCode);
            // console.log(body);
            if (res.statusCode == 200) {
                let assignmentList = body.Assignments.map((assignment) => {
                    return { value: assignment.AssignmentInstanceID, label: assignment.Assignment.DisplayName };
                });

                this.setState({
                    AssignmentList: assignmentList
                });
            }
        });
    }
    render() {
        const { AssignmentList } = this.state;
        return <Select clearable={false} searchable={false}
            options={AssignmentList} onChange={this.selectAssignment}
            value={this.props.AssignmentID}
            placeholder={this.props.Strings.Assignment + '...'} />;
        ;
    }
}

export default AssignmentInstanceSelect;