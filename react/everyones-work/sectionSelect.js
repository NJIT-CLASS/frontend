import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';

class  SectionSelectComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SectionList: []
        };

        this.selectSection = this.props.selectSection.bind(this);
    }

    componentWillMount() {
        this.getSectionList(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.getSectionList(nextProps);
    }
    getSectionList(props){
        const options = {
            userID: props.UserID,
            semesterID: props.SemesterID
        };
        apiCall.get(`/getCourseSections/${props.CourseID}`, options, (err, res, body) => {
            let sectionsList = body.Sections.map((section) => {
                return {value: section.SectionID, label: section.Name};
            });

            this.setState({
                SectionList: sectionsList
            });
        });
    }

    render() {
        let {SectionList} = this.state;

        return <Select clearable={false} searchable={false} 
            options={SectionList} onChange={this.selectSection} 
            value={this.props.SectionID}
            placeholder={this.props.Strings.Section + '...'}/>;
        ;
    }
}

export default SectionSelectComponent ;