import React from 'react';
import request from 'request';
import Select from 'react-select';

import OrganizationManager from './organization-manager';
import CourseManager from './course-manager';
import SemesterManager from './semester-manager';
import SectionManager from './section-manager';
import StudentManager from './student-manager';
import InstructorManager from './instructor-manager';
import ObserverManager from './observer-manager';

class Container extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
        this.strings = {
            active: 'Active',
            add: 'Add',
            cancel: 'Cancel',
            commaSeparatedInput: 'Comma Separated Input',
            course: 'Course',
            csvHeaders: 'Email, Last Name, First Name, Active',
            delete: 'Delete',
            edit: 'Edit',
            editCourse: 'Edit Course',
            editOrganization: 'Edit Organization',
            editSection: 'Edit Section',
            editSemester: 'Edit Semester',
            email: 'Email',
            endDate: 'End Date',
            firstName: 'First Name',
            identifier: 'Identifier',
            inactive: 'Inactive',
            instructor: 'Instructor',
            instructors: 'Instructors',
            lastName: 'Last Name',
            name: 'Name',
            new: 'New',
            newCourse: 'New Course',
            newOrganization: 'New Organization',
            newSection: 'New Section',
            newSemester: 'New Semester',
            number: 'Number',
            observer: 'Observer',
            observers: 'Observers',
            organization: 'Organization',
            save: 'Save',
            section: 'Section',
            semester: 'Semester',
            singleEntryForm: 'Single Entry Form',
            startDate: 'Start Date',
            status: 'Status',
            student: 'Student',
            students: 'Students',
            addStudents: 'Add Students',
            addStudent: 'Add Student'
        };
    }
    componentWillMount() {
        this.props.__(this.strings, (newStrings) => {
            this.strings = newStrings;
        });
    }

    changeOrganizationID(organizationID) {
        this.setState({
            organizationID: organizationID,
            courseID: null,
            semesterID: null,
            sectionID: null
        });
    }
    changeCourseID(courseID) {
        this.setState({
            courseID: courseID,
            sectionID: null
        });
    }
    changeSemesterID(semesterID) {
        this.setState({
            semesterID: semesterID,
            sectionID: null
        });
    }
    changeSectionID(sectionID) {
        this.setState({
            sectionID: sectionID
        });
    }

    render() {
        let output = [];
        output.push(
			<OrganizationManager
				key={1}
				apiUrl={this.props.apiUrl}
				changeID={this.changeOrganizationID.bind(this)}
				strings={this.strings}
				userID={this.props.UserID}
			/>
		);
        if(this.state.organizationID) {
            output.push(
				<CourseManager
					key={2}
					apiUrl={this.props.apiUrl}
					changeID={this.changeCourseID.bind(this)}
					strings={this.strings}
					userID={this.props.UserID}
					organizationID={this.state.organizationID}
				/>
			);
            output.push(
				<SemesterManager
					key={3}
					apiUrl={this.props.apiUrl}
					changeID={this.changeSemesterID.bind(this)}
					strings={this.strings}
					userID={this.props.UserID}
					organizationID={this.state.organizationID}
				/>
			);
        }
        if(this.state.courseID && this.state.semesterID) {
            output.push(
				<SectionManager
					key={4}
					apiUrl={this.props.apiUrl}
					changeID={this.changeSectionID.bind(this)}
					strings={this.strings}
					userID={this.props.UserID}
					organizationID={this.state.organizationID}
					courseID={this.state.courseID}
					semesterID={this.state.semesterID}
				/>
			);
        }
        if(this.state.sectionID) {
            output.push(
				<StudentManager
					key={5}
					apiUrl={this.props.apiUrl}
					strings={this.strings}
					userID={this.props.UserID}
					organizationID={this.state.organizationID}
					courseID={this.state.courseID}
					semesterID={this.state.semesterID}
					sectionID={this.state.sectionID}
				/>
			);
            output.push(
				<InstructorManager
					key={6}
					apiUrl={this.props.apiUrl}
					strings={this.strings}
					userID={this.props.UserID}
					organizationID={this.state.organizationID}
					courseID={this.state.courseID}
					semesterID={this.state.semesterID}
					sectionID={this.state.sectionID}
				/>
			);
            output.push(
				<ObserverManager
					key={7}
					apiUrl={this.props.apiUrl}
					strings={this.strings}
					userID={this.props.UserID}
					organizationID={this.state.organizationID}
					courseID={this.state.courseID}
					semesterID={this.state.semesterID}
					sectionID={this.state.sectionID}
				/>
			);
        }
        return (<div>{output}</div>);
    }
}

export default Container;
