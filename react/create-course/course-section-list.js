import React from 'react';

class CourseSectionList extends React.Component {
    selectSection(sectionIndex) {
        this.props.selectSection(sectionIndex);
    }

    render() {
        let sectionEls = this.props.sections.map((section, index) => {
            return (
                <li onClick={this.selectSection.bind(this, index)} key={index}>
                    <a>
                        <div>{section.name}</div>
                        <div className="right small">{section.members.length} members</div>
                    </a>
                </li>
            );
        });
        return (
            <div className="section">
                <h2 className="title">Sections</h2>
                <ul>
                    {sectionEls}
                </ul>
            </div>
        );
    }
}

CourseSectionList.defaultProps = {
    sections: []
};

export default CourseSectionList;