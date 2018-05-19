import React, { Component } from 'react';
import EveryonesWorkContainer from './everyonesWorkContainer';
import CourseSelectComponent from './courseSelect';
import SectionSelectComponent from './sectionSelect';
import AssignmentSelectComponent from './assignmentSelect';
import SemesterSelectComponent from './semesterSelect';
import TreeComponent from './treeComponent';


class MainPageContainer extends Component {
    constructor(props) {
        super(props);
        
        this.state= {
            AssignmentID: -1,
            CourseID: -1,
            SectionID: -1,
            SemesterID: -1,
            WorkflowID: -1,
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
        this.selectWorkflow = this.selectWorkflow.bind(this);
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

    selectWorkflow(WorkflowID) {
        this.setState({ WorkflowID });
    }

    unselectWorkflow() {
        this.setState({
            WorkflowID: -1
        });
    }

    render() {
        let {AssignmentID, CourseID, SemesterID, SectionID, Strings} = this.state;
        let everyonesWorkSection = null;
        if(AssignmentID != -1) {
            if (this.state.WorkflowID != -1) {
                everyonesWorkSection = <div>
                    <button onClick={this.unselectWorkflow.bind(this)}>Back</button>
                    <TreeComponent
                        UserID={this.props.UserID}
                        AssignmentID={AssignmentID}
                        WorkflowID={this.state.WorkflowID}
                    />
                </div>;
            } else {
                everyonesWorkSection = (
                    <EveryonesWorkContainer
                        UserID={this.props.UserID}
                        AssignmentID={AssignmentID}
                        selectWorkflow={this.selectWorkflow}
                    />
                );
            }
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