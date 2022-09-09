import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiCall from '../../shared/apiCall';
import Select from 'react-select';

class SemesterSelectComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SemesterList: []
        };

        this.selectSemester = this.props.selectSemester.bind(this);
    }

    componentWillMount() {
        this.getSemesterList(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getSemesterList(nextProps);
    }

    getSemesterList(props) {
        apiCall.get('/semester', (err, res, bod) => {
            let SemestersArray = bod.Semesters.map(function (Semester) {
                return ({ value: Semester.SemesterID, label: Semester.Name });
            });
            this.setState({
                SemesterList: SemestersArray
            });
        });
    }
    render() {
        let { SemesterList } = this.state;
        return <Select clearable={false} searchable={false}
            options={SemesterList} onChange={this.selectSemester}
            value={this.props.SemesterID}
            placeholder={this.props.Strings.Semester + '...'}
        />;
        ;
    }
}

export default SemesterSelectComponent;