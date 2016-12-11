import React from 'react';

class CourseDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseName: props.courseName,
            courseNumber: props.courseNumber,
            courseNameError: false,
            courseNumberError: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            courseName: nextProps.courseName,
            courseNumber: nextProps.courseNumber
        });
    }

    onCourseNameChange(e) {
        this.setState({courseName: e.target.value});
    }

    onCourseNumberChange(e) {
        this.setState({courseNumber: e.target.value});
    }

    createCourse(e) {
        e.preventDefault();

        const courseName = this.state.courseName;
        const courseNumber = this.state.courseNumber;

        const courseNameError = courseName.length === 0 ? true : false;
        const courseNumberError = courseNumber.length === 0 ? true : false;

        if (courseNameError || courseNumberError) {
            return this.setState({
                courseNameError: courseNameError,
                courseNumberError: courseNumberError
            });
        }
        else {
            this.setState({
                courseNameError: false,
                courseNumberError: false
            });
        }

        this.props.createCourse(courseName, courseNumber);
    }

    render() {
        let createCourseButtonEl = null;
        if (!this.props.courseId) {
            createCourseButtonEl = (
                <div className="row">
                    <button type="submit">Create Course</button>
                </div>
            );
        }
        else {
            createCourseButtonEl = (
                <div className="row">
                    <button type="submit" className="success" disabled>
                        <i className="fa fa-check"></i>
                        Course Created
                    </button>
                </div>
            );
        }

        return (
            <div className="section course-details">
                <h2 className="title">Course Details</h2>
                <form className="section-content" onSubmit={this.createCourse.bind(this)}>
                    <label>Course Name</label>
                    <div>
                        <input
                            type="text"
                            value={this.state.courseName}
                            onChange={this.onCourseNameChange.bind(this)}
                            className={ this.state.courseNameError ? 'error' : '' }
                        />
                    </div>
                    <label>Course Number</label>
                    <div>
                        <input
                            type="text"
                            value={this.state.courseNumber}
                            onChange={this.onCourseNumberChange.bind(this)}
                            className={ this.state.courseNumberError ? 'error' : '' }
                        />
                    </div>
                    { createCourseButtonEl }
                </form>
            </div>
        );
    }
}

CourseDetails.defaultProps = {
    courseName: '',
    courseNumber: ''
};

export default CourseDetails;
