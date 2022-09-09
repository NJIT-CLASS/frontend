import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiCall from '../../shared/apiCall';
import Select from 'react-select';

class CourseSelectComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            CourseList: []
        };

        this.selectCourse = this.props.selectCourse.bind(this);
    }

    componentWillMount() {
        this.getCourseList(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getCourseList(nextProps);
    }

    getCourseList(props) {
        apiCall.get(`/studentCourses/${props.UserID}/${props.SemesterID}`, (err, res, bod) => {

            let coursesArray = bod.courses.map(function (course) {
                return ({
                    value: course.CourseID,
                    label: course.Number + ' - ' + course.Name
                });
            });
            this.setState({
                CourseList: coursesArray
            });
        });
    }
    render() {
        let { CourseList } = this.state;
        return <Select clearable={false} searchable={false}
            options={CourseList} onChange={this.selectCourse}
            value={this.props.CourseID}
            placeholder={this.props.Strings.Course + '...'} />;
    }
}

export default CourseSelectComponent;