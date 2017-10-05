import React, { Component } from 'react';
import BasicSettings from './basic';
import strings from './strings';
import BadgeOptions from './advancedOptions1';
import LeaderboardOptions from './advancedOptions2';
import LevelOptions from './advancedOptions3';
import GoalOptions from './advancedOptions4';

class GameSettingsContainter extends Component {
    constructor(props){
        super(props);

        this.state = {
            Strings: strings
        };

    }

    render() {
        let {Strings } = this.state;
        return (
            <div>
                <BasicSettings Strings={Strings} />
                <div style={{margin: '0 auto', textAlign: 'center', width: 'fit-content'}}><button>{Strings.AdvancedOptions}</button></div>
                <BadgeOptions Strings={Strings}/>
                <LeaderboardOptions Strings={Strings}/>
                <LevelOptions Strings={Strings}/>
                <GoalOptions Strings={Strings}/>
            </div>
            
        );
    }
}

export default GameSettingsContainter ;