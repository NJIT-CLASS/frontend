import React from 'react';

class CourseDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseName: props.courseName,
            courseNumber: props.courseNumber
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
        this.props.createCourse(this.refs.courseName.value, this.refs.courseNumber.value);
        e.preventDefault();
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

        return (
            <div className="section course-details">
                <h2 className="title">Course Details</h2>
                <form className="section-content" onSubmit={this.createCourse.bind(this)}>
                    <label>Course Name</label>
                    <div>
                        <input type="text" ref="courseName" value={this.state.courseName} onChange={this.onCourseNameChange.bind(this)}/>
                    </div>
                    <label>Course Number</label>
                    <div>
                        <input type="text" ref="courseNumber" value={this.state.courseNumber} onChange={this.onCourseNumberChange.bind(this)}/>
                    </div>
                    { createCourseButtonEl }
                </form>
            </div>
        );
    }
}

export default CourseDetails;