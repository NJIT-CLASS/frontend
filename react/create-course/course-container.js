import React from 'react';
import request from 'request';

import {clone, cloneDeep} from 'lodash';

import Container from './container';

class CourseContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            courseId: null,
            courseName: '',
            courseNumber: '',
            displayMessage: null,
            organization_id: '',
            courseAbb: '',
            courseDescription: '',
            sections: []
        };
    }

    createCourse(courseName, courseNumber, courseAbb, courseDescription, organizationid) {

        console.log('create course', courseName, courseNumber);
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/course/create',
            body: {
                userid: this.props.userId,
                number: courseNumber,
                Name: courseName,
                organizationid: organizationid,
                course_abb: courseAbb,
                course_description: courseDescription
            },
            json: true
        };

        console.log(options);

        request(options, (err, res, body) => {
            const courseId = body.NewCourse;
            this.setState({
                displayMessage: body.Message,
                courseId: courseId.CourseID,
                courseName: courseName,
                courseNumber: courseNumber,
                organization_id: organizationid,
                courseAbb: courseAbb,
                courseDescription: courseDescription

            });
        });
        //alert(this.state.organization_id);
    }


    createSection(index, section) {
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/course/createsection',
            body: {
                courseid: this.state.courseId,
                semesterid: section.semesterId,
                name: section.name,
                description: section.description,
                organizationid: this.state.organization_id
            },
            json: true
        };

        request(options, (err, res, body) => {
            const courseSectionId = body.result.SectionID;
            const memberOptions = {
                method: 'POST',
                uri: this.props.apiUrl + '/api/course/adduser',
                body: {
                    sectionid: courseSectionId,
                    courseid: this.state.courseId
                },
                json: true
            };

            for (let i = 0; i < section.members.length; i++) {
                let newMemberOptions = cloneDeep(memberOptions);
                newMemberOptions.body.email = section.members[i].email;
                newMemberOptions.body.role = section.members[i].role; // set the role
                request(newMemberOptions);
            }

            // TODO get the courseSectionID and set it in the state
            if (index !== null) {
                return this.setState((previousState) => {
                    let sections = previousState.sections;
                    sections[index] = section;
                    return sections;
                });
            }

            this.setState((previousState) => {
                let sections = previousState.sections;
                sections.push(section);
                return sections;
            });
        });
    }

    render() {
        return (
            <Container
                organizationID={this.state.organization_id}
                courseAbb={this.state.courseAbb}
                courseDescription={this.state.courseDescription}
                userId={this.props.userId}
                displayMessage={this.state.displayMessage}
                courseId={this.state.courseId}
                createCourse={this.createCourse.bind(this)}
                displaySections={this.state.courseId !== null}
                courseName={this.state.courseName}
                courseNumber={this.state.courseNumber}
                createSection={this.createSection.bind(this)}
                sections={this.state.sections}
                apiUrl={this.props.apiUrl}
            />
        );
    }
}

export default CourseContainer;
