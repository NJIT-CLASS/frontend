import React, { Component } from 'react';
import strings from './strings';

import CourseSelect from '../everyones-work/courseSelect';
import SemesterSelectComponent from '../everyones-work/semesterSelect';
import SectionSelectComponent from '../everyones-work/sectionSelect';
import GameSettingsContainer from './game-settings-container';

class MainContainter extends Component {
    constructor(props){
        super(props);

        this.state = {
            Strings: strings,
            CourseID: -1,
            SectionID: -1,
            SemesterID: -1,
        };

        this.selectCourse = this.selectCourse.bind(this);
        this.selectSection = this.selectSection.bind(this);
        this.selectSemester = this.selectSemester.bind(this);
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

    selectSemester(e){
        this.setState({
            SemesterID: e.value
        });
    }

    render() {
        let {Strings,CourseID, SemesterID, SectionID } = this.state;
        let gameSettingsView = <div></div>;

        if(SectionID != -1){
            gameSettingsView = <GameSettingsContainer UserID={this.props.UserID}
                CourseID={CourseID}
                SectionID={SectionID}
                SemesterID={SemesterID}
                Strings={Strings}
            />;
        }
        return (
            <div>
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
                {gameSettingsView}
            </div>
            
        );
    }
}

export default MainContainter ;