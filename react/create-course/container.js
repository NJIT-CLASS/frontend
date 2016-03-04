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
            courseSectionsEl = <CourseSections displaySections={this.props.displaySections}/>;
        }

        return (
            <div className="course-sections">
                <CourseDetails
                    createCourse={this.props.createCourse}
                    courseId={this.props.courseId}
                    courseName={this.props.courseName}
                    courseNumber={this.props.courseNumber}
                />
                {courseSectionsEl}
            </div>
        );
    }
}

export default Container;