import React from 'react';

import Container from './container';

class CourseContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courseId: null,
            courseName: '',
            courseNumber: '',
            sections: []
        };
    }

    createCourse(courseName, courseNumber) {
        this.setState({
            courseId: 5, // TODO: make an API request here to create the course. Placeholder for now.
            courseName: courseName,
            courseNumber: courseNumber
        });
    }

    createSection(index, section) {
        if (index !== null) {
            return this.setState((previousState) => {
                let sections = previousState.sections;
                sections[index] = section;

                return sections;
            });
        }

        this.setState((previousState) => {
            let sections = previousState.sections;
            sections.push(section);

            return sections;
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
                createSection={this.createSection.bind(this)}
                sections={this.state.sections}
            />
        );
    }
}

export default CourseContainer;
