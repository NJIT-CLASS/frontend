import React from 'react';

import Select from 'react-select';

import CourseSectionList from './course-section-list';
import CourseSection from './course-section';

class CourseSections extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: props.sections,
            sectionShowingIndex: null
        };
    }

    selectSection(sectionIndex) {
        this.setState({sectionShowingIndex: sectionIndex});
    }

    render() {
        debugger;
        if (this.state.sectionShowingIndex !== null || this.state.sections.length === 0) {
            return <CourseSection section={this.state.sections[this.state.sectionShowingIndex]} members={this.state.sections[this.state.sectionShowingIndex].members}/>;
        }

        return <CourseSectionList sections={this.state.sections} selectSection={this.selectSection.bind(this)}/>;
    }
}

CourseSections.defaultProps = {
    sections: [{
        name: '101',
        description: 'this is a test description',
        members: [
        {
            email: 'srm56@njit.edu',
            role: 'individual'
        },
        {
            email: 'srmorrisonjit@gmail.com',
            role: 'student'
        }]
    }]
};

export default CourseSections;