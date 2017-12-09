import React from 'react';
import Select from 'react-select';

// important component cards for each entity type
import OrganizationManager from './organization-manager';
import CourseManager from './course-manager';
import SemesterManager from './semester-manager';
import SectionManager from './section-manager';
import UserManager from './user-manager';

// this container tracks the selected ID of each component card and makes them
// available to the others for condtional rendering and API calls
class Container extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
        this.strings = {
            active: 'Active',
            add: 'Add',
            cancel: 'Cancel',
            commaSeparatedValues: 'Comma Separated Values',
            course: 'Course',
            delete: 'Delete',
            deleteOrganization: 'Are you sure you want to delete this Organization?',
            deleteOrgDoubleCheck: 'Are you really sure? This may confuse any instructor or student who want to see related information.',
            deleteCourse: 'Are you sure you want to delete this Course?',
            deleteCourseDoubleCheck: 'Are you really sure? This may corrupt the system and affect existing course sections.',
            deleteSemester: 'Are you sure you want to delete this Semester?',
            deleteSemDoubleCheck: 'Are you really sure? This may corrupt the system and affect existing semesters.',
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
            logo: 'Logo',
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
            addStudent: 'Add Student',
            upload: 'Drag an image or click',
            volunteer: 'Volunteer',
            yes: 'Yes',
            no: 'No',
            Approved: 'Approved',
            Pending:'Pending',
            Inactive: 'Inactive',
            csvHeaders1: 'Email, First Name, Last Name, Active, Volunteer',
            csvHeaders2: 'Email, Last Name, First Name, Active, Volunteer',
            csvHeaders3: 'First Name, Last Name, Email, Active, Volunteer',
            csvHeaders4: 'Last Name, First Name, Email, Active, Volunteer',
            csvHeaders5: 'First Name, Email, Last Name, Active, Volunteer',
            csvHeaders6: 'Last Name, Email, First Name, Active, Volunteer'
        };
    }
    // uncomment this translation function when it is functional again
    componentWillMount() {
        this.props.__(this.strings, (newStrings) => {
            this.setState({Strings: newStrings});
        });
    }
    // store selected organization ID to state, reset downstream IDs
    changeOrganizationID(organizationID) {
        this.setState({
            organizationID: organizationID,
            courseID: null,
            semesterID: null,
            sectionID: null
        });
    }
    // store selected course ID to state, reset downstream IDs
    changeCourseID(courseID) {
        this.setState({
            courseID: courseID,
            sectionID: null
        });
    }
    // store selected semester ID to state, reset downstream IDs
    changeSemesterID(semesterID) {
        this.setState({
            semesterID: semesterID,
            sectionID: null
        });
    }
    // store selected section ID to state
    changeSectionID(sectionID) {
        this.setState({
            sectionID: sectionID
        });
    }

    // render container with component cards
    // changeID function to send state back to parent
    // pass strings as props (all strings are declared in this file)
    // key is given because elements are being rendered as array (React requirement)
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
                    organizationID={this.state.organizationID}
                    changeID={this.changeSectionID.bind(this)}
                    strings={this.strings}
                    userID={this.props.UserID}
                    courseID={this.state.courseID}
                    semesterID={this.state.semesterID}
                />
            );

        }
        // the next three components are all UserManagers
        // the only difference between student, insrtuctor, and observer is
        // the role prop (used in API calls) and the title prop (used in interface)
        if(this.state.sectionID) {
            output.push(
                <UserManager
                    key={5}
                    apiUrl={this.props.apiUrl}
                    strings={this.strings}
                    userID={this.props.UserID}
                    sectionID={this.state.sectionID}
                    role="Student"
                    title={this.strings.students}
                />
            );
            output.push(
                <UserManager
                    key={6}
                    apiUrl={this.props.apiUrl}
                    strings={this.strings}
                    userID={this.props.UserID}
                    sectionID={this.state.sectionID}
                    role="Instructor"
                    title={this.strings.instructors}
                />
            );
            output.push(
                <UserManager
                    key={7}
                    apiUrl={this.props.apiUrl}
                    strings={this.strings}
                    userID={this.props.UserID}
                    sectionID={this.state.sectionID}
                    role="Observer"
                    title={this.strings.observers}
                />
            );
        }
        return (<div>
            {output}
        </div>);
    }
}

export default Container;
