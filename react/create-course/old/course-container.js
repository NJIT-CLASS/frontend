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
            sections: []
        };
    }


    createCourse(courseName, courseNumber) {
      console.log('create ourse', courseName, courseNumber)
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/course/create',
            body: {
                userid: this.props.userId,
                number: courseNumber,
                Name: courseName,
                organizationid:1
            },
            json: true
        };

        request(options, (err, res, body) => {
            const courseId = body.NewCourse;

            this.setState({
                courseId: courseId.CourseID,
                courseName: courseName,
                courseNumber: courseNumber
            });
        });
    }

    createSection(index, section) {
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/course/createsection',
            body: {
                courseid: this.state.courseId,
                semesterid: section.semesterId.value, // TODO: make this not static
                name: section.name,
                description: section.description,
                organizationid: 1
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
            }

            for (let i = 0; i < section.members.length; i++) {
                let newMemberOptions = cloneDeep(memberOptions);
                newMemberOptions.body.email = section.members[i].email;

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