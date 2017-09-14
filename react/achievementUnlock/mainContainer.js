import React, { Component } from 'react';
import CourseSelect from '../everyones-work/courseSelect';
import SemesterSelectComponent from '../everyones-work/semesterSelect';
import AchievementUnlockContainer from './achievementUnlockContainer';
import SectionSelectComponent from '../everyones-work/sectionSelect';
import apiCall from '../shared/apiCall';
import {isEmpty} from 'lodash';

import strings from './strings';

class MainContainer extends Component {
    constructor(props){
        super(props);

        this.state = {
            Strings: strings,
            CourseID: -1,
            SectionID: -1,
            SemesterID: -1,
            SectionUserID: null,
            CourseInfo: {}
        };

        this.selectCourse = this.selectCourse.bind(this);
        this.selectSection = this.selectSection.bind(this);
        this.selectSemester = this.selectSemester.bind(this);
    }
    componentDidMount() {
        this.props.__(strings, newStrings => {
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

        this.fetchSectionUser(e.value);
        this.fetchCourseInfo(this.state.CourseID);
        
        
    }

    fetchSectionUser(sectionId){
        apiCall.get(`/sectionUserInfo/${this.props.UserID}/${sectionId}`, (err,res, body) => {
            if(body.Info != null){
                this.setState({
                    SectionUserID: body.Info.SectionUserID
                });
            } else {
                showMessage(this.state.Strings.NoRecords);
            }
            
        });
    }

    fetchCourseInfo(courseId){
        apiCall.get(`/course/${courseId}`, (err,res,body)=> {
            this.setState({
                CourseInfo: body.Course
            });
        });
    }

    selectSemester(e){
        this.setState({
            SemesterID: e.value
        });
    }

    render() {
        let {Strings, SectionUserID, CourseID, SemesterID, SectionID, CourseInfo} = this.state;
        let achievementUnlock = null;
        let courseTitle = null;
        if(!isEmpty(CourseInfo)){
            courseTitle = `${CourseInfo.Number} - ${Strings.XPLevelAndEC}`;
        }
        if(SectionUserID !== null){
            achievementUnlock = <AchievementUnlockContainer 
                SectionUserID={SectionUserID} 
                Strings={Strings}
                CourseInfo={CourseInfo}
            />;
        }
        return (
            <div>
                <div className="top-section">
                    <div style={{display: 'inline-block'}}>
                        <SemesterSelectComponent selectSemester={this.selectSemester} 
                            SemesterID={SemesterID}
                            Strings={Strings}
                        />
                        <CourseSelect selectCourse={this.selectCourse}
                            UserID={this.props.UserID}
                            Strings={Strings}
                            CourseID={CourseID}/>
                        <SectionSelectComponent selectSection={this.selectSection} 
                            UserID={this.props.UserID}
                            CourseID={CourseID}
                            SectionID={SectionID}
                            SemesterID={SemesterID}
                            Strings={Strings}
                        /> 
                    </div>
                    <div className="course-number-text">
                        { courseTitle}
                    </div>
                </div>
                {achievementUnlock}
            </div>
        );
    }
}

export default MainContainer;