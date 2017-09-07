import React, { Component } from 'react';
import EveryonesWorkContainer from './everyonesWorkContainer';
import CourseSelectComponent from './courseSelect';
import SectionSelectComponent from './sectionSelect';
import AssignmentSelectComponent from './assignmentSelect';
import SemesterSelectComponent from './semesterSelect';


class MainPageContainer extends Component {
    constructor(props) {
        super(props);

        this.state= {
            AssignmentID: this.props.AssignmentID ,
            CourseID: -1,
            SectionID: -1,
            SemesterID: -1,
            Strings: {
                Course: 'Course',
                Semester: 'Semester',
                Assignment: 'Assignment',
                Section: 'Section'
            }
        };

        this.selectAssignment = this.selectAssignment.bind(this);
        this.selectCourse = this.selectCourse.bind(this);
        this.selectSection = this.selectSection.bind(this);
        this.selectSemester = this.selectSemester.bind(this);
    }

    componentDidMount() {
        this.props.__(this.state.Strings, newStrings => {
            this.setState({Strings: newStrings});
        });
    }
    selectCourse(e){
        this.setState({
            CourseID: e.value
        });
    }

    selectSection(e){
        this.setState({
            SectionID: e.value
        });
    }

    selectAssignment(e){
        this.setState({
            AssignmentID: e.value
        });
    }
    selectSemester(e){
        this.setState({
            SemesterID: e.value
        });
    }

    render() {
        let {AssignmentID, CourseID, SemesterID, SectionID, Strings} = this.state;
        let everyonesWorkSection = null;
        if(AssignmentID != ':assignmentId'){
            everyonesWorkSection = (
                <EveryonesWorkContainer UserID={this.props.UserID} AssignmentID={AssignmentID}/>
            );
        }
        return (
            <div>
                <SemesterSelectComponent selectSemester={this.selectSemester} 
                    SemesterID={SemesterID}
                    Strings={Strings}
                />
                <CourseSelectComponent selectCourse={this.selectCourse}
                    UserID={this.props.UserID}
                    Strings={Strings}
                    CourseID={CourseID}
                />
                <SectionSelectComponent selectSection={this.selectSection} 
                    UserID={this.props.UserID}
                    CourseID={CourseID}
                    SectionID={SectionID}
                    SemesterID={SemesterID}
                    Strings={Strings}
                />
                <AssignmentSelectComponent selectAssignment={this.selectAssignment}
                    SectionID={SectionID}
                    AssignmentID={AssignmentID}
                    Strings={Strings}
                />
                {everyonesWorkSection}
            </div>
        );
    }
}

export default MainPageContainer;