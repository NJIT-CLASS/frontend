import React from 'react';

class CourseSectionList extends React.Component {
    selectSection(sectionIndex) {
        this.props.selectSection(sectionIndex);
    }
    createNewSection() {
        this.props.selectSection();
    }

    render() {
        let lastIndex = 0;

        let sectionEls = this.props.sections.map((section, index) => {
            lastIndex = index;
            return (
                <li onClick={this.selectSection.bind(this, index)} key={index}>
                    <div>{section.name}</div>
                    <div className="right small">{section.members.length} members</div>
                </li>
            );
        });

        sectionEls.push((
            <li onClick={this.createNewSection.bind(this)} key={++lastIndex}>
                <div>Create New Section</div>
            </li>
        ));

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
