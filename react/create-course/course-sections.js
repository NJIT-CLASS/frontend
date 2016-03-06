import React from 'react';

import Select from 'react-select';

import CourseSectionList from './course-section-list';
import CourseSection from './course-section';

class CourseSections extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: props.sections,
            sectionShowingIndex: null,
            newSectionShowing: true
        };
    }

    selectSection(sectionIndex=null) {
        this.setState({
            sectionShowingIndex: sectionIndex,
            newSectionShowing: true
        });
    }

    createSection(section) {
        this.props.createSection(this.state.sectionShowingIndex, section);

        this.setState({
            sectionShowingIndex: null,
            newSectionShowing: false
        });
    }

    render() {
        if ((this.state.sectionShowingIndex === null && this.state.newSectionShowing) || this.state.sectionShowingIndex !== null || this.state.sections.length === 0) {
            return (
                <CourseSection 
                    section={this.state.sections[this.state.sectionShowingIndex]}
                    createSection={this.createSection.bind(this)}
                />
            );
        }

        return <CourseSectionList sections={this.state.sections} selectSection={this.selectSection.bind(this)}/>;
    }
}

CourseSections.defaultProps = {
    sections: []
};

export default CourseSections;
