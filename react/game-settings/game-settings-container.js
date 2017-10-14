import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicSettings from './basic';
import BadgeOptions from './advancedOptions1';
import LeaderboardOptions from './advancedOptions2';
import LevelOptions from './advancedOptions3';
import GoalOptions from './advancedOptions4';
class  GameSettingsContainer extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let {Strings,CourseID, SemesterID, SectionID } = this.props;
        
        return (
            <div>
                <BasicSettings Strings={Strings} CourseID={CourseID}
                    SectionID={SectionID}
                    SemesterID={SemesterID}/>
                <div style={{margin: '0 auto', textAlign: 'center', width: 'fit-content'}}><button>{Strings.AdvancedOptions}</button></div>
                <BadgeOptions Strings={Strings} CourseID={CourseID}
                    SectionID={SectionID}
                    SemesterID={SemesterID}/>
                <LeaderboardOptions Strings={Strings} CourseID={CourseID}
                    SectionID={SectionID}
                    SemesterID={SemesterID}/>
                <LevelOptions Strings={Strings} CourseID={CourseID}
                    SectionID={SectionID}
                    SemesterID={SemesterID}/>
                <GoalOptions Strings={Strings} CourseID={CourseID}
                    SectionID={SectionID}
                    SemesterID={SemesterID}/>
            </div>
            
        );
    }
}

export default GameSettingsContainer ;