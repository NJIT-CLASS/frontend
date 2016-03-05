import React from 'react';

import Container from './container';

class CourseContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseId: null,
            courseName: '',
            courseNumber: ''
        };
    }

    createCourse(courseName, courseNumber) {
        this.setState({
            courseId: 5, // TODO: make an API request here to create the course. Placeholder for now.
            courseName: courseName,
            courseNumber: courseNumber
        });
    }

    render() {
        return (
            <Container
                courseId={this.state.courseId}
                createCourse={this.createCourse.bind(this)}
                displaySections={this.state.courseId !== null}
                courseName={this.state.courseName}
                courseNumber={this.state.courseNumber}
            />
        );
    }
}

export default CourseContainer;