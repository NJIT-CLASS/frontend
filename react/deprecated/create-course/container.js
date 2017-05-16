import React from 'react';
import CourseDetails from './course-details';
import CourseSections from './course-sections';

class Container extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let courseSectionsEl = null;

        if (this.props.displaySections) {
            courseSectionsEl = (
                <CourseSections
                    displaySections={this.props.displaySections}
                    courseName={this.props.courseName}
                    courseNumber={this.props.courseNumber}
                    sections={this.props.sections}
                    createSection={this.props.createSection}
                    organizationID={this.props.organizationID}
                    courseAbb={this.props.courseAbb}
                    apiUrl={this.props.apiUrl}
                />
            );
        }

        return (
            <div className="course-sections">
                <CourseDetails
                    userId={this.props.userId}
                    displayMessage={this.props.displayMessage}
                    createCourse={this.props.createCourse}
                    courseId={this.props.courseId}
                    courseName={this.props.courseName}
                    courseNumber={this.props.courseNumber}
                    apiUrl={this.props.apiUrl}
                />
                {courseSectionsEl}
            </div>
        );
    }
}

export default Container;
